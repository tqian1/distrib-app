import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, App, ItemSliding, List, NavController, LoadingController, NavParams, ModalController } from 'ionic-angular';
import { DeliveryData } from '../../providers/delivery-data';
import { TaskPage } from '../../pages/task/task';
import { filterModal } from './filterModal';

declare var google;

@Component({
  templateUrl: 'build/pages/tasks/tasks.html',
})
export class TasksPage {

  @ViewChild('map') mapElement: ElementRef;
  currentShift: any = {};
  currentTask: any = {};
  map: any;

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  segment = 'list'; // or map
  labelIndex = 0;
  mapLoaded = false;

  filters = {
    incomplete: true,
    active: true,
    completed: false,
    pickup: true,
    delivery: true,
    displayNum: 20,
    start: true
  };

  constructor (
    public app: App,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public delivData: DeliveryData,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) { }

  ionViewWillEnter() {
    this.getCurrentShift();
  }

  ngAfterViewChecked(){
    if (this.segment === 'map' && this.mapLoaded === false) {
      this.loadMap();
      this.mapLoaded = true;
    }
  }

  filterChange() {
    let modal = this.modalCtrl.create(filterModal, this.filters);
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.filters = data;
        this.getCurrentShift();
      }
    });
  }

  getCurrentShift(refresher?) {
    this.delivData.getCurrentShift().then(shift => {
      let filters = {id: shift};
      this.delivData.getShifts(filters)
        .subscribe(data => {
          this.currentShift = data;
        }, err => {
          this.handleError(err, 'noshift');
        }, () => {
          if (refresher) {
            refresher.complete();
          };
        });
    });
  }

  getNextTask() {
    for (let i = 0; i < this.currentShift.waypoints.length; i++) {
      let task = this.currentShift.waypoints[i];
      if ( task.status === "active") { 
        this.currentTask = task;
        return;
      } else if (task.status==="incomplete") {
        this.currentTask = task; 
        return;
      }
    }
  }

  viewTask(task, index) {
    this.navCtrl.push(TaskPage, {shift: this.currentShift, task: task, index: index});
  }

  loadMap() {
    this.labelIndex = 0; // reset label index
    //  let latLng = new google.maps.LatLng(this.currentShift.waypoints[0].location.latitude, this.currentShift.waypoints[0].location.longitude);
    let mapOptions = {
      center: { lat: 53.5438, lng: -113.4956},
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    if (this.currentShift) {
      this.addWaypoints();
    }
  }

  addWaypoints() {
    for (var i = 0; i < this.currentShift.waypoints.length; i++) {
      let waypoint = this.currentShift.waypoints[i];
      this.addMarker({ lat: waypoint.location.latitude, lng: waypoint.location.longitude })
    }
  }

  addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      label: this.alphabet[this.labelIndex++],
      map: this.map
    });
  }

  getMinutes(seconds) {
    return Math.round(seconds/60);
  }

  handleError(err, type) {
    let message = 'Problem with server';
    let submessage = err;
    if (type === 'noshift') {
      message = 'No shift selected';
      submessage = 'View a shift';
    }
    let alert = this.alertCtrl.create({
      title: message,
      subTitle: submessage,
      buttons: ['OK']
    });
    alert.present();
  }

}