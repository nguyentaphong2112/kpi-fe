import {Injectable} from "@angular/core";
import { debounce, debounceTime, of } from 'rxjs';

interface ICache {
  response: any;
  group: string;
  time: number;
  ttl: number;
}
@Injectable({
  providedIn: 'root',
})
export class CacheService {

  map = new Map<string, ICache>();
  mapGroup = new Map<string, Set<string>>();
  constructor() {
    setInterval(() => {
      const arrUrl: string[] = [];
      for (const [key, value] of this.map) {
        if (new Date().getTime() > value.time + value.ttl) {
          arrUrl.push(key);
        }
      }
      arrUrl.forEach(url => {
        this.invalidate(url);
      })
    }, 3000);
  }
  setCache(url: string, httpResponse: any, group?: string, ttl?: number) {
    this.map.set(url, {response: httpResponse ? JSON.stringify(httpResponse) : null, group: group, ttl: ttl ? ttl * 1000 : 30000, time: new Date().getTime()});
    if (group) {
      if (this.mapGroup.has(group)) {
        this.mapGroup.get(group).add(url);
      } else {
        this.mapGroup.set(group, new Set<string>([url]));
      }
    }
  }

  getCache(url: string) {
    if (this.map.has(url)) {
      const data = this.map.get(url);
      if (new Date().getTime() > data.time + data.ttl) {
        this.invalidate(url);
        return null;
      } else {
        return of(data.response ? JSON.parse(data.response) : null).pipe(debounceTime(100));
      }
    }
    return null;
  }

  invalidate(url: string) {
    this.map.delete(url);
  }

  invalidateGroup(group: string) {
    if (this.mapGroup.has(group)) {
      this.mapGroup.get(group).forEach(url => {
        this.invalidate(url);
      })
      this.mapGroup.delete(group);
    }
  }
}