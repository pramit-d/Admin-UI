import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';


/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 11-10-2017
 * Objective: # A service which would handle the HOSPITAL MASTER services.
 */

@Injectable()
export class HospitalMasterService {
  admin_Base_Url: any;
  common_Base_Url: any;

  get_State_Url: any;
  get_Service_Url: any;
  get_District_Url: any;
  get_Taluk_Url: any;

  get_Institution_Url: any;
  create_Institution_Url: any;
  edit_Institution_Url: any;
  delete_Institution_Url: any;

  constructor(private http: SecurityInterceptedHttp,
    public basepaths: ConfigService,
    private httpIntercept: InterceptedHttp) {
    this.admin_Base_Url = this.basepaths.getAdminBaseUrl();
    this.common_Base_Url = this.basepaths.getCommonBaseURL();

    this.get_State_Url = this.admin_Base_Url + 'm/role/stateNew';
    this.get_Service_Url = this.admin_Base_Url + 'm/role/serviceNew';
    this.get_District_Url = this.common_Base_Url + 'location/districts/';
    this.get_Taluk_Url = this.common_Base_Url + 'location/taluks/';

    this.get_Institution_Url = this.admin_Base_Url + 'm/getInstution';
    this.create_Institution_Url = this.admin_Base_Url + 'm/createInstution';
    this.edit_Institution_Url = this.admin_Base_Url + 'm/editInstution';
    this.delete_Institution_Url = this.admin_Base_Url + 'm/deleteInstution';
  };



  getServices(userID) {
    return this.httpIntercept.post(this.get_Service_Url, {
      'userID': userID
    }).map(this.handleState_n_ServiceSuccess)
      .catch(this.handleError);
  }

  getStates(userID, serviceID, isNational) {
    return this.httpIntercept.post(this.get_State_Url,
      {
        'userID': userID,
        'serviceID': serviceID,
        'isNational': isNational
      })
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  getDistricts(stateId) {
    return this.httpIntercept.get(this.get_District_Url + stateId)
      .map(this.handleSuccess)
      .catch(this.handleError);

  }

  getTaluks(districtId) {
    return this.httpIntercept.get(this.get_Taluk_Url + districtId)
      .map(this.handleSuccess)
      .catch(this.handleError);

  }


  getInstitutions(data) {
    return this.httpIntercept.post(this.get_Institution_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  saveInstitution(data) {
    return this.httpIntercept.post(this.create_Institution_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  editInstitution(data) {
    return this.httpIntercept.post(this.edit_Institution_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  deleteInstitution(data) {
    return this.httpIntercept.post(this.delete_Institution_Url, data)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }


  handleState_n_ServiceSuccess(response: Response) {

    console.log(response.json().data, 'role service file success response');
    let result = [];
    result = response.json().data.filter(function (item) {
      if (item.serviceID === 3 || item.serviceID === 1 || item.serviceID === 2 || item.serviceID === 6) {
        return item;
      }
    });
    return result;
  }


  handleSuccess(res: Response) {
    console.log(res.json().data, 'HOSPITAL-MASTER-SERVICE file success response');
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  handleError(error: Response | any) {
    return Observable.throw(error.json());

  }




};



