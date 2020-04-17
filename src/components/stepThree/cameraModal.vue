<template>
  <modal name="cameraModal">
    <div class="modal__heading">
      <div slot="top-right">
        <button type="button" class="modal__close-btn" @click="hide">
          <svgicon icon="cancel" class="modal__close"></svgicon>
        </button>
      </div>
      <div class="modal__title-wrap">
        <h3 class="modal__title">Take a selfie of yourself</h3>
      </div>
    </div>
    <div class="modal__wrap price__modal-wrap position-relative">
      <div class="identification__focus"></div>
      <WebCam
        ref="webcam"
        width="100%"
        height="100%"
        :deviceId="deviceId"
        @cameras="onCameras"
        @camera-change="onCameraChange"
        :isFrontCam="frontCam"
        :debug="true"
        screenshotFormat="image/jpeg"
      ></WebCam>
    </div>

    <div class="modal__footer">
      <button type="button" class="cta__btn" @click="onCapture">Capture</button>
    </div>
  </modal>
</template>

<script>
import { WebCam } from "vue-cam-vision";
import { find, head } from "lodash";

export default {
  name: "cameraModal",
  components: {
    WebCam
  },
  data() {
    return {
      captures: [],
      imgReport: [],
      frontCam: false,
      webcam: null,
      camera: null,
      deviceId: null,
      devices: [],
      img: null,
      imgUpload: false
    };
  },
  methods: {
    hide() {
      this.onStop();
      this.$modal.hide("cameraModal");
    },
    beforeOpen(event) {
      this.item = event.params.item;
    },
    onStop() {
      this.$refs.webcam.stop();
    },
    async onCapture() {
      this.img = await this.$refs.webcam.capture();
      this.checkUpload();
      this.updateImage();
      this.updateSuccess();
      this.hide();
    },
    onCameras(cameras) {
      this.devices = cameras;
      //   console.log("On Cameras Event", cameras);
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
      //   console.log("On Camera Change Event", deviceId);
    },
    updateImage(img) {
      this.$emit("updateSnappedImg", this.img);
      this.onStop();
      this.hide();
    },
    updateSuccess(imgUpload) {
      this.$emit("updateImgUpload", this.imgUpload);
      this.onStop();
    },
    checkUpload() {
      if (this.img != null) {
        this.imgUpload = true;
      } else {
        this.imgUpload = false;
      }
    }
  },
  computed: {
    device: function() {
      return find(this.devices, n => n.deviceId == this.deviceId);
    }
  },
  watch: {
    camera: function(id) {
      this.deviceId = id;
    },
    devices: function() {
      if (typeof window.orientation === "undefined") {
        // Once we have a list select the first one
        let first = head(this.devices);
        if (first) {
          this.camera = first.deviceId;
          this.deviceId = first.deviceId;
        }
      } else {
        this.frontCam = false;
      }
    }
  }
};
</script>