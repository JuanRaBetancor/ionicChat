import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { AngularFireStorage } from 'angularfire2/storage';


/**
 * Generated class for the NewgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-newgroup',
  templateUrl: 'newgroup.html',
})
export class NewgroupPage {
  newgroup = {
    groupName: 'GroupName',
    groupPic: 'https://image.freepik.com/free-icon/multiple-users-silhouette_318-49546.jpg'
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public groupservice: GroupsProvider, public imghandler: ImghandlerProvider,
              public loadingCtrl: LoadingController, public storage: AngularFireStorage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewgroupPage');
  }

  chooseimage() {
    if (this.newgroup.groupName == 'GroupName') {
      let namealert = this.alertCtrl.create({
        buttons: ['okay'],
        message: 'Please enter the groupname first. Thanks'
      });
      namealert.present();
    }
    else {
      let loader = this.loadingCtrl.create({
        content: 'Loading, please wait..'
      });
      this.imghandler.openActionSheet().then(async(image: string) => {
        if(image) {
          loader.present();
        }
        console.log("Comienza subida");
        console.log(image);
        var d = new Date();
        var n = d.getTime();
        var newFileName = 'temp'+  n + ".jpg";
        let ref = this.storage.ref('groups/'+newFileName);
        await ref.put(image);
        loader.dismiss();
        console.log("Termina subida");
        ref.getDownloadURL().subscribe(url => {
          console.log(url);
          this.newgroup.groupPic = url;
        });
      }).catch(error => {
        console.log("ERROR: " + JSON.stringify(error));
      })
    }
  }

  creategroup() {
    this.groupservice.addgroup(this.newgroup).then(() => {
      this.navCtrl.pop();
    }).catch((err) => {
      alert(JSON.stringify(err));
    })
  }

  editgroupname() {
    let alert = this.alertCtrl.create({
      title: 'Edit Group Name',
      inputs: [{
        name: 'groupname',
        placeholder: 'Give a new groupname'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
        {
          text: 'Set',
          handler: data => {
            if (data.groupname) {
              this.newgroup.groupName = data.groupname
            }

            else {
              this.newgroup.groupName = 'groupName';
            }
          }
        }
      ]
    });
    alert.present();
  }

}
