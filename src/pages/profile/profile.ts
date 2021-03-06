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
  email: string;
  user = firebase.auth().currentUser;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userservice: UserProvider, public zone: NgZone, public alertCtrl: AlertController,
              public imghandler: ImghandlerProvider, public file: File, public storage: AngularFireStorage, public loadingCtrl: LoadingController) {
    this.email = this.user.email;
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

  changepassword(){
    let statusalert = this.alertCtrl.create({
      buttons: ['OK']
    });
    let alert = this.alertCtrl.create({
      title: 'Edit Password',
      inputs: [
        {name: 'newpass',
          type: 'password',
          placeholder: 'New password'},
        {name: 'repnewpass',
          type: 'password',
          placeholder: 'Repeat new password'}],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: data => {

        }
      },
        {
          text: 'Edit',
          handler: data => {
            if (data.newpass != null && data.repnewpass != null) {
              if(data.newpass.length >= 7){
                if(data.newpass == data.repnewpass) {
                  this.userservice.updatepassword(data.newpass).then((res: any) => {
                    if (res.success) {
                      statusalert.setTitle('Updated');
                      statusalert.setSubTitle('Your password has been changed successfully!!');
                      statusalert.present();
                    }
                    else {
                      statusalert.setTitle('Failed');
                      statusalert.setSubTitle('Your password was not changed');
                      statusalert.present();
                    }
                  })
                }else{
                  statusalert.setTitle('Failed');
                  statusalert.setSubTitle('These password are not the same');
                  statusalert.present();
                }
              }else{
                statusalert.setTitle('Failed');
                statusalert.setSubTitle('The new password have less than 7 character');
                statusalert.present();
              }
            }else{
              statusalert.setTitle('Failed');
              statusalert.setSubTitle('Are fields are required');
              statusalert.present();
            }
          }

        }]
    });
    alert.present();
  }

  editemail(){
    let statusalert = this.alertCtrl.create({
      buttons: ['OK']
    });
    let alert = this.alertCtrl.create({
      title: 'Edit Email',
      inputs: [{
        name: 'newemail',
        type: 'email',
        placeholder: 'New email'
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
            if (data.newemail) {
              this.userservice.updateemail(data.newemail).then((res: any) => {
                if (res.success) {
                  statusalert.setTitle('Updated');
                  statusalert.setSubTitle('Your email has been changed successfully!!');
                  statusalert.present();
                  this.zone.run(() => {
                    this.email = data.newemail;
                  })
                }

                else {
                  statusalert.setTitle('Failed');
                  statusalert.setSubTitle('Your email was not changed');
                  statusalert.present();
                }

              })
            }
          }

        }]
    });
    alert.present();
  }

  editimage() {
    let statusalert = this.alertCtrl.create({
      buttons: ['OK']
    });
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    this.imghandler.openActionSheet().then(async(image: string) => {
      if(image){loader.present();}
      console.log("Comienza subida");
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
      buttons: ['OK']
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

  removeuser(){
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    let alert = this.alertCtrl.create({
      title: 'Warning!',
      message: 'Do you want to remove yout account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Accept',
          handler: () => {
            console.log('Accept clicked');
            this.userservice.deleteuser().then((res: any) => {
              if (res.success) {
                statusalert.setTitle('Removed');
                statusalert.setSubTitle('Your account was successfully removed!!');
                statusalert.present();
                this.navCtrl.parent.parent.setRoot('LoginPage');
              }

              else {
                statusalert.setTitle('Failed');
                statusalert.setSubTitle('Your account was not removed');
                statusalert.present();
              }

            })
          }
        }
      ]
    });
    alert.present();

  }

}
