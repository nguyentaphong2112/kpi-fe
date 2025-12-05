import { Injectable } from '@angular/core';
import {BaseCrudService} from "@core/services/base/base-crud.service";
import {Demo} from "../models";
import {MICRO_SERVICE} from "../common-constant";
@Injectable({
    providedIn: 'root'
})
export class DemoService extends BaseCrudService<Demo> {
  protected override serviceName = MICRO_SERVICE.ADMIN;
  protected override urlEndpoint = '/v1/resource'
}
