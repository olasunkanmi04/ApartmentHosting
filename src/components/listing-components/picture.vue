<template>
  <div v-if="level==4">
    <form action>
      <div class="listing__wrap">
        <div class="listing__container">
          <div class="picture__top">
            <h3 class="listing__title mb-2">Add pictures to your listing</h3>
            <span class="picture__tips" @click="pictureTipsShow">
              <svgicon icon="tips" class="picture__tips-icon"></svgicon>Photo tip
            </span>
          </div>

          <p
            class="form__input-info picture__subtitle"
          >Photos help members imagine staying in your place. You can start with one and add more after you publish.</p>
          <p class="error" v-show="errorMsg">You haven't added any image</p>
          <div>
            <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
              <div class="dropbox picture__upload">
                <input
                  type="file"
                  multiple
                  :name="uploadFieldName"
                  :disabled="isSaving"
                  @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                  accept="image/*"
                  class="input-file"
                />
                <div v-if="isInitial">
                  <p class="picture__upload-text">
                    <button class="cta__btn">Upload Images</button>
                    or drag them in
                  </p>
                </div>
                <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
              </div>
            </form>

            <!--SUCCESS-->
            <div v-if="isSuccess" class="picture__upload-success">
              <form enctype="multipart/form-data" novalidate>
                <label class="form__add d-block">
                  <span>+Add more</span>
                  <input
                    type="file"
                    multiple
                    :name="uploadFieldName"
                    @change="addChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                    accept="image/*"
                    class="input-file picture__more"
                  />
                </label>
              </form>
            </div>

            <div class="row mx-0 mt-3">
              <div
                class="col-lg-4 col-md-4 col-sm-6 col-12 mb-3"
                v-for="(item, index) in selectedImages"
                :key="index"
              >
                <div class="picture__upload-list">
                  <div
                    class="picture__upload-list-img"
                    :style="{backgroundImage: 'url('+item+')'}"
                    :id="index"
                  >
                    <div class="picture__upload-delete" @click="deleteImage(index)">
                      <svgicon icon="delete" class="picture__upload-delete-icon"></svgicon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--FAILED-->
            <div v-if="isFailed">
              <h2>Uploaded failed.</h2>
              <p>
                <a href="javascript:void(0)" @click="reset()">Try again</a>
              </p>
              <pre>{{ uploadError }}</pre>
            </div>
          </div>
          <div class="picture__modal">
            <PictureModal></PictureModal>
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
          <button type="button" @click="propertyImages" class="step__next cta__btn">Next</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import PictureModal from "./pictureTips";
import { upload } from "./pictureService.js";
import Multiselect from "vue-multiselect";
import {
  roomImage,
  getPropertyImages,
  propertyImages,
  saveAndExit
} from "../../../services/listing";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  name: "pictures",
  components: {
    PictureModal,
    Multiselect
  },
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "image",
      selectedType: [],
      imageSelect: [],
      formData: "",
      errorMsg: false,
      selectedImages: [],
      listingId: this.$route.params.id
    };
  },
  methods: {
    nextStep() {
      if (this.selectedImages.length == 0) {
        this.errorMsg = true;
        return;
      } else {
        this.propertyImages();
      }
    },
    saveAndExit() {
      saveAndExit(
        this.listingId,
        this.$store.getters.level,
        this.$store.getters.step
      ).then(data => {
        if (data.data.success) {
          this.incrementLevel();
        }
      });
    },
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    pictureTipsShow() {
      this.$modal.show("PictureModal");
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    onSelect(selectedOption, id) {
      const imageValue = {
        uploadIndex: id,
        imageName: this.uploadedFiles[id].fileName,
        imageType: selectedOption
      };
      //this.imageSelect.push(imageValue);
      var objIndex = this.imageSelect.filter(obj => obj.uploadIndex == id);

      if (objIndex.length) {
        this.imageSelect.splice(id, 1, imageValue);
        // console.log(this.imageSelect);
      } else {
        return this.imageSelect.push(imageValue);
      }
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      roomImage(formData)
        .then(x => {
          this.uploadedFiles = x.data.data;
          if (x.data.success) {
            var i = 0;
            for (i = 0; i < this.uploadedFiles.length; i++) {
              this.selectedImages.push(this.uploadedFiles[i].url);
            }
          }
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = STATUS_FAILED;
        });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });
      this.save(formData);
    },
    addChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();
      if (fileList.length) {
        // append the files to FormData
        Array.from(Array(fileList.length).keys()).map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name);
        });
        // save it
        this.save(formData);
      }
    },
    deleteImage(id) {
      this.uploadedFiles.splice(id, 1);
      this.selectedImages.splice(id, 1);
    },
    async propertyImages() {
      await propertyImages(this.listingId, this.selectedImages)
        .then(data => {
          if (data.data.success) {
            this.saveAndExit();
          }
        })
        .catch(function(err) {
          throw err;
        });
    },
    async getPropertyImages() {
      await getPropertyImages(this.listingId)
        .then(data => {
          if (data.data.success) {
            if (data.data.data.length > 0) {
              this.selectedImages = [];
              this.currentStatus = STATUS_SUCCESS;
            }
            var i = 0;
            for (i = 0; i < data.data.data.length; i++) {
              this.selectedImages.push(data.data.data[i].img_url);
            }
          }
        })
        .catch(function(err) {
          throw err;
        });
    }
  },
  computed: {
    level() {
      return this.$store.getters.level;
    },
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  mounted() {
    this.reset();
    this.getPropertyImages();
  }
};
</script>