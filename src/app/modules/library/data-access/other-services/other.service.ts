import { Injectable } from '@angular/core';
import {BaseCrudService} from "@core/services/base/base-crud.service";
import {Demo} from "../models";
import {MICRO_SERVICE} from "../common-constant";
@Injectable({
    providedIn: 'root'
})
export class OtherService extends BaseCrudService<Demo> {
  protected override serviceName = MICRO_SERVICE.DEFAULT;
  protected override urlEndpoint = 'v1/demo'
}
