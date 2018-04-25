import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IonicImageViewerModule} from "ionic-img-viewer";



/**
 * Generated class for the MainpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mainpage',
  templateUrl: 'mainpage.html',
})
export class MainpagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public imageViewer: IonicImageViewerModule) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainpagePage');
  }

  entrar() {
    this.navCtrl.push('LoginPage');
  }

}
