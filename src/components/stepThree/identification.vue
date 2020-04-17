<template>
  <div class="prop">
    <form action>
      <div class="listing__wrap">
        <div class="listing__container">
          <h3 class="listing__title mb-2">Identification/Photo ID</h3>
          <p
            class="form__input-info picture__subtitle"
          >After adding your selected National ID, we will check to see if the photo of your ID matches the new photo you’ll take of youself</p>

          <div class="memRequire">
            <div class="identification__wrap">
              <div class="row mx-0">
                <div class="col-lg-8 col-sm-12 px-0 form__row">
                  <div class="form__upload-wrap identification__upload-wrap">
                    <p class="form__label">Upload a valid ID</p>
                    <div class="form__upload" :style="{backgroundImage: 'url('+previewID+')'}">
                      <input type="file" class="identification__upload" @change="uploadID" />
                      <div class="identification__upload-placeholder-wrap">
                        <input type="file" class="identification__upload" @change="uploadID" />
                        <svgicon
                          icon="image-placeholder"
                          class="identification__upload-placeholder"
                          v-show="!previewSuccess"
                        ></svgicon>
                        <p class="form__section-title mb-0">Tap to upload Valid ID</p>
                      </div>
                    </div>

                    <div>
                      <label for class="form__label">Select what type of document you uploaded</label>
                      <div class="form__select">
                        <multiselect
                          v-model="documentType"
                          :searchable="false"
                          :options="documentTypeOptions"
                        ></multiselect>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-8 col-sm-12 px-0 form__row">
                  <div class="form__upload-wrap">
                    <p class="form__label">Take a selfie of yourself</p>
                    <div class="form__upload" :style="{backgroundImage: 'url('+img+')'}">
                      <div class="camera__icon">
                        <svgicon
                          v-show="!imgUpload"
                          icon="camera"
                          class="identification__upload-placeholder"
                        ></svgicon>
                      </div>
                    </div>
                    <button
                      class="cta__btn"
                      type="button"
                      @click="cameraModalShow"
                    >{{imgUpload ? "Retake a selfie" : "Take a selfie"}}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="step">
        <div class="step__wrap">
          <div class="step__prev">
            <button
              type="button"
              class="alt__btn"
              v-show="level > 1"
              @click="decrementLevel"
            >Previous</button>
          </div>

          <button type="button" @click="incrementLevel" class="step__next cta__btn">Next</button>
        </div>
      </div>

      <div class="identification__modal">
        <cameraModal :img="img" @updateSnappedImg="updateImage" @updateImgUpload="updateSuccess"></cameraModal>
      </div>
    </form>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import cameraModal from "./cameraModal";
import {
  addIdentification,
  saveAndExit,
  uploadId
} from "../../../services/listing";

export default {
  name: "identification",
  components: {
    Multiselect,
    cameraModal
  },
  data() {
    return {
      documentType: "",
      documentTypeOptions: [
        "International ID",
        "Driver’s License",
        "National ID card",
        "Voter's Card"
      ],
      img: null,
      imgUpload: false,
      previewID: null,
      idUrl: null,
      imgUrl: null,
      previewSuccess: false,
      listingId: this.$route.params.id,
      userId: ""
    };
  },
  methods: {
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    cameraModalShow() {
      this.$modal.show("cameraModal");
    },
    updateImage(value) {
      this.img = value;
      this.cameraUpload(value);
    },
    updateSuccess(value) {
      this.imgUpload = value;
    },
    uploadID(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.previewID = e.target.result;
        this.previewSuccess = true;
        this.uploadId(this.previewID);
      };
    },
    submitData() {
      addIdentification(this.userId, this.idUrl, this.img, this.documentType)
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          return err;
        });
    },
    uploadId(value) {
      uploadId(value)
        .then(data => {
          console.log(data);
          if (data.data.success) {
            this.idUrl = data.data.data.url;
          }
        })
        .catch(err => {
          return err;
        });
    },
    cameraUpload(value) {
      uploadId(value)
        .then(data => {
          console.log(data);
          if (data.data.success) {
            this.imgUrl = data.data.data.url;
          }
        })
        .catch(err => {
          return err;
        });
    }
  },
  computed: {
    level() {
      return this.$store.state.level;
    }
  },
  mounted() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.userId = user.user.uuid;
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>