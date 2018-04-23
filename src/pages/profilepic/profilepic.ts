import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import { AngularFireStorage } from 'angularfire2/storage';
import { UserProvider } from '../../providers/user/user';
import { File } from "@ionic-native/file";
import { FileChooser } from "@ionic-native/file-chooser";
//import * as firebase from "firebase";
import { ImageViewerController } from 'ionic-img-viewer';


/**
 * Generated class for the ProfilepicPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profilepic',
  templateUrl: 'profilepic.html',
})
export class ProfilepicPage {
  imgurl = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
  moveon = true;
  _imageViewerCtrl: ImageViewerController;
  public photo = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';

  constructor(public navCtrl: NavController, public navParams: NavParams, public imgservice: ImghandlerProvider,
              public zone: NgZone, public userservice: UserProvider, public loadingCtrl: LoadingController,
              public fileChooser: FileChooser, public file: File, public storage: AngularFireStorage, public imageViewerCtrl: ImageViewerController) {
    this._imageViewerCtrl = imageViewerCtrl;
  }

  ionViewDidLoad() {
  }

  upload() {
    //aqui subir la foto
    //vamos a obviar como si hubiera un chat
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    this.imgservice.openActionSheet().then(async(image: string) => {
      if(image){
        loader.present();
      }
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
        this.photo = url;
        this.imgurl = url;
        this.moveon = false;
      });
    }).catch(error => {
      console.log("ERROR: " + JSON.stringify(error));
    })
  }


  presentImage(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();

    //setTimeout(() => imageViewer.dismiss(), 1000);
    //imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }

  /*
  choose(){
    this.fileChooser.open().then((uri)=>{
      alert(uri);

      this.file.resolveLocalFilesystemUrl(uri).then((newUrl)=>{
        alert(JSON.stringify(newUrl));
        let dirPath = newUrl.nativeURL;
        let dirPathSegments = dirPath.split('/');
        dirPathSegments.pop();
        dirPath = dirPathSegments.join('/');
        this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async (buffer) => {
          await this.upload(buffer, newUrl.name);
        })
      })
    })
  }

  async upload(buffer, name){
    let blob = new Blob([buffer], {type: "image/jpeg"});

    let storage = firebase.storage();

    storage.ref('image/'+name).put(blob).then((d)=>{
      alert("Done");
    }).catch((error)=>{
      alert(JSON.stringify(error))
    })
  }*/

  chooseimage() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.imgservice.uploadimage().then((uploadedurl: any) => {
      loader.dismiss();
      this.zone.run(() => {
        this.imgurl = uploadedurl;
        this.moveon = false;
      })
    })
  }

  updateproceed() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.userservice.updateimage(this.imgurl).then((res: any) => {
      loader.dismiss();
      if (res.success) {
        this.navCtrl.setRoot('TabsPage');
      }
      else {
        alert(res);
      }
    })
  }

  proceed() {
    this.navCtrl.setRoot('TabsPage');
  }

}
