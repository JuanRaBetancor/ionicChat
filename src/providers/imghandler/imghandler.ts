import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController, Platform } from 'ionic-angular';

/*
  Generated class for the ImghandlerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

declare var cordova: any;

@Injectable()
export class ImghandlerProvider {
  nativepath: any;
  firestore = firebase.storage();
  constructor(public filechooser: FileChooser,
              private actionSheetCtrl: ActionSheetController,
              private platform: Platform,
              private camera: Camera,
              private file: File,
              private filepath: FilePath) {
  }


  /*

  For uploading an image to firebase storage.

  Called from - profilepic.ts
  Inputs - None.
  Outputs - The image url of the stored image.

   */

  uploadimage() {
    var promise = new Promise((resolve, reject) => {
      this.filechooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                var imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
                imageStore.put(imgBlob).then((res) => {
                  this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                    resolve(url);
                  }).catch((err) => {
                    reject(err);
                  })
                }).catch((err) => {
                  reject(err);
                })
              }
            })
          })
        })
      })
    });
    return promise;
  }

  picmsgstore() {
    var promise = new Promise((resolve, reject) => {
      this.filechooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                var uuid = this.guid();
                var imageStore = this.firestore.ref('/picmsgs').child(firebase.auth().currentUser.uid).child('picmsg' + uuid);
                imageStore.put(imgBlob).then((res) => {
                  resolve(res.downloadURL);
                }).catch((err) => {
                  reject(err);
                })
                  .catch((err) => {
                    reject(err);
                  })
              }
            })
          })
        })
      })
    });
    return promise;
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  grouppicstore(groupname) {
    var promise = new Promise((resolve, reject) => {
      this.filechooser.open().then((url) => {
        (<any>window).FilePath.resolveNativePath(url, (result) => {
          this.nativepath = result;
          (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
            res.file((resFile) => {
              var reader = new FileReader();
              reader.readAsArrayBuffer(resFile);
              reader.onloadend = (evt: any) => {
                var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                var imageStore = this.firestore.ref('/groupimages').child(firebase.auth().currentUser.uid).child(groupname);
                imageStore.put(imgBlob).then((res) => {
                  this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).child(groupname).getDownloadURL().then((url) => {
                    resolve(url);
                  }).catch((err) => {
                    reject(err);
                  })
                }).catch((err) => {
                  reject(err);
                })
              }
            })
          })
        })
      })
    });
    return promise;
  }


  openActionSheet(){
    return new Promise((fulfill,reject)=>{
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Agregar foto',
        buttons: [
          {
            text: 'Cámara',
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.CAMERA).then(imageName => {
                fulfill(imageName);
              }).catch(error => reject(error));
            }
          },
          {
            text: 'Librería de fotos',
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY).then(imageName => {
                fulfill(imageName);
              }).catch(error => reject(error));
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              return fulfill(null);
            }
          }
        ]
      });
      actionSheet.present();
    });

  }

  private takePicture(sourceType):Promise<any>{
    //Create Options for camera
    return new Promise((fulfill,reject)=>{
      let options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        saveToPhotoAlbum: false,
        targetWidth: 800,
        targetHeight: 1200,
        correctOrientation: true
      };
      // Get the data of an image
      this.camera.getPicture(options).then((imagePath) => {

        fulfill(this.dataURItoBlob('data:image/jpeg;base64,' + imagePath));

      }, (err) => {
        console.log(err);
        reject(err);
      });

    });
  }

  /**
   * Convertir la data de la imagen a blob
   * @param  dataURI [description]
   */
  dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };

  /**
   * Creación del nombre del archivo
   * @return {string}
   */
  public createFileName(){
    var d = new Date(),
      n = d.getTime(),
      newFileName = 'temp'+  n + ".jpg";
    return newFileName;
  }


}
