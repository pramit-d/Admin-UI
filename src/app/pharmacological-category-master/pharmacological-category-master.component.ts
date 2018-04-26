import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PharmacologicalMasterService } from '../services/inventory-services/pharmacological-category-service';
import { CommonServices } from '../services/inventory-services/commonServices';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';

@Component({
  selector: 'app-pharmacological-category-master',
  templateUrl: './pharmacological-category-master.component.html',
  styleUrls: ['./pharmacological-category-master.component.css']
})
export class PharmacologicalCategoryMasterComponent implements OnInit {

  providerServiceMapID: any;
  createdBy: any;
  userID: any;
  showFormFlag: boolean = false;
  showTableFlag: boolean = false;
  disableSelection: boolean = false;
  services: any = [];
  states: any = [];
  pharmacologyCategories: any = [];
  pharmaCategoryArrayObj: any = [];

  @ViewChild('pharmacologicalCategoryForm') pharmacologicalCategoryForm: NgForm;
  constructor(public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService,
    public commonServices: CommonServices,
    private pharmacologyService: PharmacologicalMasterService) 
    { 
     
    }


  ngOnInit() {
    this.createdBy = this.commonDataService.uname;
    this.userID = this.commonDataService.uid;
    this.getAllServices();
  }
  getAllServices() {
    this.commonServices.getServiceLines(this.userID).subscribe((response) => {
      console.log("serviceline", response);
      this.servicesSuccesshandler(response),
        (err) => console.log("ERROR in fetching serviceline")
    });
  }
  servicesSuccesshandler(res) {
    this.services = res.filter((item) => {
      console.log('item', item);
      if (item.serviceID != 6) {
        return item;
      }
    })
  }
  setProviderServiceMapID(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;
    console.log('psmid', this.providerServiceMapID);
    this.getPharmacologicalCategoryList(this.providerServiceMapID);
  }

  getStates(service) {
    debugger;
    console.log("value", service);
    this.commonServices.getStatesOnServices(this.userID, service.serviceID, false).
      subscribe(response => this.getStatesSuccessHandeler(response, service), (err) => {
        console.log("error in fetching states")
      });
  }
  getStatesSuccessHandeler(response, service) {
    this.states = response;
    console.log("states", this.states);

  }
  getPharmacologicalCategoryList(providerServiceMapID) {
    this.providerServiceMapID = providerServiceMapID;
    this.pharmacologyService.getAllPharmacologyList(providerServiceMapID).subscribe((responseList) => 
      this.categoryListSuccessHandler(responseList),
      (err) => { console.log("Error Items not found", err) });     
  }

  categoryListSuccessHandler(responseList) {
    console.log('category list', responseList);
        this.pharmacologyCategories = responseList;
        this.showTableFlag = true;

  }
  showForm() {
    this.showFormFlag = true;
    this.showTableFlag = false;
    this.disableSelection = true;
  }
  add_pharmaObj(formValue) {

    let pharmaObj = {
      "pharmCategoryCode": formValue.code,
      "pharmCategoryName": formValue.name,
      "pharmCategoryDesc": formValue.description,
      "status": "Active",
      "providerServiceMapID": this.providerServiceMapID,
      "createdBy": this.commonDataService.uname
    }

    if (this.pharmaCategoryArrayObj.length == 0 && (pharmaObj.pharmCategoryCode != "" && pharmaObj.pharmCategoryCode != undefined)) {
      this.pharmaCategoryArrayObj.push(pharmaObj);
    }
    else {
      let count = 0;
      for (let i = 0; i < this.pharmaCategoryArrayObj.length; i++) {
        if (pharmaObj.pharmCategoryCode === this.pharmaCategoryArrayObj[i].pharmCategoryCode) {
          count = count + 1;
        }
      }
      if (count == 0 && (pharmaObj.pharmCategoryCode != "" && pharmaObj.pharmCategoryCode != undefined)) {
        this.pharmaCategoryArrayObj.push(pharmaObj);
      }
    }
  }
  removeRow(index) {
    this.pharmaCategoryArrayObj.splice(index, 1);
  }
}