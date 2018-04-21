import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { UserProvider } from '../../providers/user/user';
import { AngularFireStorage } from 'angularfire2/storage';
import { File } from "@ionic-native/file";
import firebase from 'firebase';
/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  avatar: string;
  displayName: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userservice: UserProvider, public zone: NgZone, public alertCtrl: AlertController,
              public imghandler: ImghandlerProvider, public file: File, public storage: AngularFireStorage, public loadingCtrl: LoadingController) {
  }

  ionViewWillEnter() {
    this.loaduserdetails();
  }



  loaduserdetails() {
    this.userservice.getuserdetails().then((res: any) => {
      this.displayName = res.displayName;
      this.zone.run(() => {
        this.avatar = res.photoURL;
      })
    })
  }



  editimage() {
    let statusalert = this.alertCtrl.create({
      buttons: ['OK']
    });
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    this.imghandler.openActionSheet().then(async(image: string) => {
      console.log("Comienza subida");
      loader.present();
      console.log(image);
      var d = new Date();
      var n = d.getTime();
      var newFileName = 'temp'+  n + ".jpg";
      let ref = this.storage.ref('chats/'+newFileName);
      await ref.put(image);
      loader.dismiss();
      ref.getDownloadURL().subscribe(url => {
        console.log(url);
        this.userservice.updateimage(url).then((res: any) => {
          if (res.success) {
            statusalert.setTitle('Updated');
            statusalert.setSubTitle('Your profile pic has been changed successfully!!');
            statusalert.present();
            this.zone.run(() => {
              this.avatar = url;
            })
          }
        }).catch((err) => {
          statusalert.setTitle('Failed');
          statusalert.setSubTitle('Your profile pic was not changed');
          statusalert.present();
      });
    })
  });
    loader.dismiss();
  }




/*editimage() {
  let statusalert = this.alertCtrl.create({
    buttons: ['okay']
  });
  this.imghandler.uploadimage().then((url: any) => {
    this.userservice.updateimage(url).then((res: any) => {
      if (res.success) {
        statusalert.setTitle('Updated');
        statusalert.setSubTitle('Your profile pic has been changed successfully!!');
        statusalert.present();
        this.zone.run(() => {
          this.avatar = url;
        })
      }
    }).catch((err) => {
      statusalert.setTitle('Failed');
      statusalert.setSubTitle('Your profile pic was not changed');
      statusalert.present();
    })
  })
}*/

  editname() {
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    let alert = this.alertCtrl.create({
      title: 'Edit Nickname',
      inputs: [{
        name: 'nickname',
        placeholder: 'Nickname'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
        {
          text: 'Edit',
          handler: data => {
            if (data.nickname) {
              this.userservice.updatedisplayname(data.nickname).then((res: any) => {
                if (res.success) {
                  statusalert.setTitle('Updated');
                  statusalert.setSubTitle('Your nickname has been changed successfully!!');
                  statusalert.present();
                  this.zone.run(() => {
                    this.displayName = data.nickname;
                  })
                }

                else {
                  statusalert.setTitle('Failed');
                  statusalert.setSubTitle('Your nickname was not changed');
                  statusalert.present();
                }

              })
            }
          }

        }]
    });
    alert.present();
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.navCtrl.parent.parent.setRoot('LoginPage');
    })
  }


}
