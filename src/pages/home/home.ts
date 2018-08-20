import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import * as getUserMedia from 'get-user-media-promise';

declare var navigator: any;
declare var cordova: any;
declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private diagnostic: Diagnostic,
    private platform: Platform
  ) { }

  ionViewDidLoad() {
    // Uncomment this for in-browser test
    // this.startVideoStream();

    this.platform.ready().then(() => {
      // Ask for a camera permission if needed
      this.diagnostic.isCameraAvailable().then((status) => {
        console.log("Is camera available", status);

        if (status) {
          this.requestMicrophoneAndStartStream();
        } else {
          this.diagnostic.requestCameraAuthorization().then((status) => {
            console.log('requestCameraAuthorization:', status);
            this.requestMicrophoneAndStartStream();
          });
        }
      }).catch((err) => {
        console.log("Is camera available error", err);
      });
    });
  }

  private requestMicrophoneAndStartStream() {
    // Ask for a microphone permission if needed
    this.diagnostic.isMicrophoneAuthorized().then((status) => {
      console.log('Is microphone available:', status);

      if (status) {
        this.startVideoStream();
      } else {
        this.diagnostic.requestMicrophoneAuthorization().then((status) => {
          console.log('requestMicrophoneAuthorization:', status);
          this.startVideoStream();
        });
      }
    });
  }

  private startVideoStream() {
    // Ios solution using iosrtc plugin
    // cordova.plugins.iosrtc.getUserMedia({ audio: true, video: { width: 500, height: 500 } },
    //   function(stream) {
    //     console.log("Im streaming!!", stream);
    //     var video = document.querySelector('video');
    //     console.log("video element", video);
    //     video.src = window.URL.createObjectURL(stream);
    //     video.onloadedmetadata = function(e) {
    //       console.log("stream start");
    //       video.play();
    //     };
    //   },
    //   function(err) {
    //     console.log("The following error occurred: " + err);
    //   }
    // );

    // Android and in-browser solution using get-user-media-promise lib to use
    // promises instead of native callback implementation
    return getUserMedia({ audio: true, video: { width: 500, height: 500 } }).then((stream) => {
      console.log("Im streaming!!", stream);
      var video = document.querySelector('video');
      console.log("video element", video);
      video.src = window.URL.createObjectURL(stream);
      video.onloadedmetadata = function(e) {
        console.log("stream start");
        video.play();
      };
    }).catch((err) => {
      console.log("The following error occurred: " + err);
    });
  }

}
