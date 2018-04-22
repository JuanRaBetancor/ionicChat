import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';

@IonicPage()
@Component({
  selector: 'page-groupinfo',
  templateUrl: 'groupinfo.html',
})
export class GroupinfoPage {
  groupmembers;
  public groupowner;
  public logoowner;
  constructor(public navCtrl: NavController, public navParams: NavParams, public groupservice: GroupsProvider,
              public events: Events) {
  }

  ionViewDidLoad() {
    this.groupservice.getownership(this.groupservice.currentgroupname).then((res) => {
      this.groupowner = this.groupservice.ownergroup.displayName;
      this.logoowner = this.groupservice.ownergroup.photoURL;
      console.log(this.groupowner);
      console.log(this.logoowner);
      if (res)
        this.groupmembers = this.groupservice.currentgroup;
      else {
        this.groupservice.getgroupmembers();
      }
    });


    this.events.subscribe('gotmembers', () => {
      this.groupmembers = this.groupservice.currentgroup;
    });

  }

  ionViewWillLeave() {
    this.events.unsubscribe('gotmembers');
  }


}
