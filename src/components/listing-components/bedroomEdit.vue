<template>
  <div class="bdrm__edit">
    <div class="bdrm__edit-wrap">
      <div class="bdrm__edit-info">
        <p class="bdrm__edit-name">Bedroom {{numBedroom +1}}</p>
        <div class="bdrm__edit-master">
          <label class="form__check-container">
            <input
              type="radio"
              name="masterBedroom"
              class="form__check"
              :value="'Bedroom ' + (numBedroom +1)"
              v-model="bedroom.masterBed"
            />
            <span class="form__check-label">Is this a master bedroom?</span>
            <span class="form__check-checkmark"></span>
          </label>
        </div>
      </div>
      <div class="bdrm__edit-btn-wrap">
        <button class="alt__btn" type="button" @click="isHidden = true" v-if="!isHidden">Edit room</button>
        <button class="alt__btn" type="button" @click="doneWithRoom" v-if="isHidden">Done</button>
      </div>
    </div>

    <transition name="bathroomAni">
      <div class="bathroom__wrap" v-show="isHidden">
        <div class="bdrm__bathroom">
          <label for class="form__label">Is there an ensuite or adjoining Bathroom?</label>

          <div class="row mx-0 form__row">
            <div class="col-lg-5 col-md-6 col-sm-12 px-0 mb-2">
              <label class="form__check-wrap">
                <label class="form__check-container">
                  <input
                    type="radio"
                    name="bathroomType"
                    class="form__check"
                    value="Ensuite bathroom"
                    v-model="bedroom.bathroomType"
                  />
                  <span class="form__check-label">Ensuite bathroom</span>
                  <span class="form__check-checkmark"></span>
                </label>
              </label>
            </div>
            <div class="col-lg-7 col-md-6 col-sm-12 px-0 px-sm-4">
              <p class="form__input-info">Private bathtub or shower and toilet</p>
            </div>
          </div>
          <div class="row mx-0 form__row">
            <div class="col-lg-5 col-md-6 col-sm-12 px-0 mb-2">
              <label class="form__check-wrap">
                <label class="form__check-container">
                  <input
                    type="radio"
                    name="bathroomType"
                    class="form__check"
                    value="Adjoining bathroom"
                    v-model="bedroom.bathroomType"
                  />
                  <span class="form__check-label">Adjoining bathroom</span>
                  <span class="form__check-checkmark"></span>
                </label>
              </label>
            </div>
            <div class="col-lg-7 col-md-6 col-sm-12 px-0 px-sm-4">
              <p class="form__input-info">Bathtub or shower and toilet, shared between 2 bedrooms</p>
            </div>
          </div>
          <div class="row mx-0 form__row">
            <div class="col-lg-5 col-md-6 col-sm-12 px-0 mb-2">
              <label class="form__check-wrap">
                <label class="form__check-container">
                  <input
                    type="radio"
                    name="bathroomType"
                    class="form__check"
                    value="Shared bathroom"
                    v-model="bedroom.bathroomType"
                  />
                  <span class="form__check-label">Shared bathroom</span>
                  <span class="form__check-checkmark"></span>
                </label>
              </label>
            </div>
            <div class="col-lg-7 col-md-6 col-sm-12 px-0 px-sm-4">
              <p
                class="form__input-info"
              >One Bathtub or shower and toilet shared by everyone in the property</p>
            </div>
          </div>
        </div>

        <div class="bdrm__furnish">
          <label for class="form__label">What type of furnishing is in Bedroom {{numBedroom +1}}?</label>
          <span class="form__add" @click="bathFurnShow">+Add</span>
          <Modal
            :numBedroom="numBedroom"
            @updateBedAmenities="updateBedroom"
            :bedroomAmenities="bedroomAmenities"
            :amenities="amenities"
            :modalTitle="newModalTitle"
            :modalSubtitle="newModalSubtitle"
            :name="bdrmAmenityName"
          />
          <div class="bdrm__furnish-wrap">
            <div
              class="bdrm__furnish-indvdul"
              v-for="(bedroomAmenity, id) in bedroomAmenities"
              :key="id"
            >
              <span>{{ bedroomAmenity }}</span>
              <svgicon
                icon="cancel"
                class="bdrm__furnish-indvdul-icon"
                @click="deleteAmenityOn(id)"
              ></svgicon>
            </div>
          </div>
        </div>

        <div class="bdrm__images">
          <div class="d-flex">
            <p class="form__label mr-auto">Upload bedroom images</p>

            <form enctype="multipart/form-data" novalidate>
              <label class="form__add d-block ml-auto">
                <span v-if="!isSuccess">+Add</span>
                <input
                  type="file"
                  multiple
                  :name="uploadFieldName"
                  @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                  accept="image/*"
                  class="input-file picture__more"
                />
              </label>
              <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
            </form>
          </div>

          <!-- <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
            <div class="dropbox bdrm__upload">
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
          </form>-->

          <!--SUCCESS-->
          <div v-if="isSuccess" class="picture__upload-success">
            <form enctype="multipart/form-data" novalidate>
              <label class="form__add d-block ml-auto">
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

            <div class="row mx-0">
              <div
                class="col-lg-3 col-sm-4 col-6 mb-3"
                v-for="(item, index) in uploadedFiles"
                :key="index"
              >
                <div class="picture__upload-list">
                  <div
                    class="bdrm__img-list"
                    :style="{backgroundImage: 'url('+require('../../assets/images/'+item.fileName+'')+')'}"
                    :imageName="item.fileName"
                    :id="index"
                  >
                    <div class="bdrm__img-delete" @click="deleteImage(index)">
                      <svgicon icon="cancel" class="bdrm__img-delete-icon"></svgicon>
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
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { upload } from "./pictureService.js";
import Modal from "./modal";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  name: "bedroomEdit",
  components: {
    Multiselect,
    Modal
  },
  data() {
    return {
      bedroom: {
        key: "",
        bathroomType: "",
        masterBed: "",
        amenities: "",
        images: ""
      },
      bedroomAmenities: [],
      isHidden: false,
      numBedroom: this.$vnode.key,
      modalTitle: "What type of furnishing is in Bedroom ",
      modalSubtitle: "Select furnishings you have in bedroom ",
      name: "bedroom",
      amenities: [
        {
          name: "Bed",
          icon: "bed"
        },
        {
          name: "Air Conditioner",
          icon: "air-conditioner"
        },
        {
          name: "Double Bed",
          icon: "double-bed"
        },
        {
          name: "Hanger",
          icon: "hanger"
        },
        {
          name: "Lock on bedroom door",
          icon: "lock-on-bedroom-door"
        },
        {
          name: "Mirror",
          icon: "mirror"
        },
        {
          name: "Pillow",
          icon: "pillow"
        },
        {
          name: "Side Drawer",
          icon: "side-drawe"
        },
        {
          name: "Wardrobe",
          icon: "wardrobe"
        },
        {
          name: "Bathtub",
          icon: "bathtub"
        },
        {
          name: "Bedsheet",
          icon: "bed-sheet"
        },
        {
          name: "Balcony",
          icon: "balcony"
        }
      ],
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos",
      selectedType: [],
      imageSelect: [],
      formData: ""
    };
  },
  methods: {
    incrementLevel() {
      this.$store.dispatch("incrementActionLevel", 1);
    },
    decrementLevel() {
      this.$store.dispatch("decrementActionLevel", 1);
    },
    bedroomCountIncrement() {
      this.$store.dispatch("bedroomIncrementAction", 1);
    },
    bedroomCountDecrement() {
      this.$store.dispatch("bedroomDecrementAction", 1);
    },
    bathFurnShow() {
      this.$modal.show(this.bdrmAmenityName);
    },
    updateBedroom(value) {
      this.bedroomAmenities = value;
    },
    deleteAmenityOn(id) {
      this.bedroomAmenities.splice(id, 1);
    },
    hide() {
      this.$modal.hide(this.name);
    },

    doneWithRoom() {
      this.bedroom.key = this.numBedroom + 1;
      this.bedroom.amenities = this.bedroomAmenities;
      this.bedroom.images = this.uploadedFiles;
      this.$emit("updateBedroom", this.bedroom);
      this.isHidden = false;
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

      upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = STATUS_FAILED;
        });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      this.formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map(x => {
        this.formData.append(fieldName, fileList[x], fileList[x].name);
      });

      // save it
      //   for (var soemth in this.formData.get(fieldName)) {
      //     console.log(soemth);
      //   }
      this.save(this.formData);
    },
    addChange(fieldName, fileList) {
      // handle file changes

      if (fileList.length) {
        // append the files to FormData
        Array.from(Array(fileList.length).keys()).map(x => {
          this.formData.append(fieldName, fileList[x], fileList[x].name);
        });

        // save it
        this.save(this.formData);
      }
    },
    deleteImage(id) {
      this.uploadedFiles.splice(id, 1);
    }
  },
  computed: {
    level() {
      return this.$store.getters.level;
    },
    bedroomCount() {
      return this.$store.getters.bedroomCount;
    },
    bdrmAmenityName() {
      return this.name + this.numBedroom;
    },
    newModalTitle() {
      return this.modalTitle + Number(this.numBedroom + 1);
    },
    newModalSubtitle() {
      return this.modalSubtitle + Number(this.numBedroom + 1);
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
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>