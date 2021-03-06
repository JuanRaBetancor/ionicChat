import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { AngularFireStorage } from 'angularfire2/storage';
import { File } from "@ionic-native/file";
import { ImageViewerController } from 'ionic-img-viewer';

import firebase from 'firebase';
/**
 * Generated class for the BuddychatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild('content') content: Content;
  buddy: any;
  newmessage;
  allmessages = [];
  photoURL;
  imgornot;
  _imageViewerCtrl: ImageViewerController;

  constructor(public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider,
              public events: Events, public zone: NgZone, public loadingCtrl: LoadingController,
              public imgstore: ImghandlerProvider, public file: File, public storage: AngularFireStorage, public imageViewerCtrl: ImageViewerController) {
    this.buddy = this.chatservice.buddy;
    this._imageViewerCtrl = imageViewerCtrl;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.buddymessages;
        for (var key in this.allmessages) {
          var d = new Date(this.allmessages[key].timestamp);
          var hours = d.getHours();
          var minutes = "0" + d.getMinutes();
          var month = d.getMonth();
          var da = d.getDate();

          var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          var formattedTime = monthNames[month] + "-" + da + "-" + hours + ":" + minutes.substr(-2);

          this.allmessages[key].timestamp = formattedTime;
          if (this.allmessages[key].message.substring(0, 4) == 'http')
            this.imgornot.push(true);
          else
            this.imgornot.push(false);
        }
      })


    })
  }

  presentImage(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();

    //setTimeout(() => imageViewer.dismiss(), 1000);
    //imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }


  addmessage() {
    this.chatservice.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    this.chatservice.getbuddymessages();
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  sendPicMsg() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.imgstore.picmsgstore().then((imgurl) => {
      loader.dismiss();
      this.chatservice.addnewmessage(imgurl).then(() => {
        this.scrollto();
        this.newmessage = '';
      })
    }).catch((err) => {
      alert(err);
      loader.dismiss();
    })
  }


  sendPic() {
    //aqui subir la foto
    //vamos a obviar como si hubiera un chat
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    this.imgstore.openActionSheet().then(async(image: string) => {
      loader.present();
      console.log("Comienza subida");
      console.log(image);
      var d = new Date();
      var n = d.getTime();
      var newFileName = 'temp'+  n + ".jpg";
      let ref = this.storage.ref('chats/'+newFileName);
      await ref.put(image);
      ref.getDownloadURL().subscribe(url => {
        console.log(url);
        this.chatservice.addnewmessage(url).then(() => {
          this.scrollto();
          this.newmessage = '';
        });
        loader.dismiss();
      });
    }).catch(error => {
      console.log("ERROR: " + JSON.stringify(error));
      loader.dismiss();
    })
  }



}
