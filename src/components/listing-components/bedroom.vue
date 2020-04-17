<template>
  <div>
    <div class="bdrm__delete">
      <v-dialog />
    </div>

    <div class="bdrm__wrap">
      <div class="listing__container">
        <div class="bdrm__form">
          <h3 class="listing__title">Add your room(s)</h3>
          <div v-if="!bedroomForm">
            <button
              class="alt__btn d-block"
              type="button"
              @click="showForm"
              :class="{ disable: studio }"
              :disabled="studio ? true : false"
            >Add more room</button>
          </div>
          <div id="bed-wrap" v-if="bedroomForm">
            <form action @submit.prevent="saveRoom">
              <div class="bathroom__wrap">
                <div class="row mx-0 form__row bdrm__master">
                  <div class="col-lg-8 px-0">
                    <div class="bdrm__edit-master">
                      <label for class="form__label">Is this a Master Bedrooom?</label>

                      <div class="d-flex form__row">
                        <div class="mr-4">
                          <input
                            class="styled-radio"
                            id="masterBedYes"
                            type="radio"
                            name="masterBedroom"
                            :value="true"
                            v-model.lazy="bedroom.is_master_bedroom"
                            :disabled="disableMasterBed"
                            :class="{ disable: disableMasterBed }"
                          />
                          <label for="masterBedYes" :class="{ disable: disableMasterBed }">Yes</label>
                        </div>
                        <div>
                          <input
                            class="styled-radio"
                            id="masterBedNo"
                            type="radio"
                            name="masterBedroom"
                            :value="false"
                            v-model.lazy="bedroom.is_master_bedroom"
                            :class="{ disable: disableMasterBed }"
                          />
                          <label for="masterBedNo" :class="{ disable: disableMasterBed }">No</label>
                        </div>
                      </div>

                      <float-label class="form-group mb-2">
                        <div class="mb-2" v-if="submitted && $v.bedroom.name.$error">
                          <div
                            class="error"
                            v-if="!$v.bedroom.name.required"
                          >Bedroom name is required</div>
                        </div>
                        <input
                          type="text"
                          name="bedroomName"
                          placeholder="Bedroom Name"
                          v-model="bedroom.name"
                          class="form__input"
                        />
                      </float-label>
                      <p class="form__input-info">E.g: Bedroom 1, Bedroom 2, or Bedroom A, Bedroom B</p>
                    </div>
                  </div>
                </div>

                <div class="bdrm__bathroom">
                  <label for class="form__label">Bathroom type</label>
                  <div class="mb-2" v-if="submitted && $v.bathroomValue.$error">
                    <div class="error" v-if="!$v.bathroomValue.required">Bathroom type is required</div>
                  </div>
                  <div class="row mx-0">
                    <div class="col-lg-8 col-sm-12 px-0 mb-2">
                      <div class="form__select">
                        <multiselect
                          v-model="bathroomValue"
                          :options="bathrooms"
                          @select="bathroomSelect"
                          track-by="name"
                          label="name"
                          :searchable="false"
                        ></multiselect>
                      </div>
                    </div>
                  </div>
                  <div class="row mx-0 form__row">
                    <div class="col-sm-8 px-0">
                      <p class="form__input-info">{{ bathroomInfo }}</p>
                    </div>
                  </div>
                </div>

                <div class="bdrm__furnish">
                  <label for class="form__label">What type of furnishing is in this Bedroom?</label>
                  <div class="mb-2" v-if="submitted && $v.bedroomAmenities.$error">
                    <div
                      class="error"
                      v-if="!$v.bedroomAmenities.required"
                    >You haven't added any furnishing</div>
                  </div>
                  <div class="row mx-0">
                    <div class="col-lg-8 col-sm-12 px-0 mb-2">
                      <div class="form__select">
                        <multiselect
                          v-model="bedroomAmenities"
                          :options="amenities"
                          track-by="name"
                          label="name"
                          :multiple="true"
                          :taggable="true"
                          placeholder="Search amenities"
                        >
                          <template slot="option" slot-scope="props">
                            <span class="option__title">{{ props.option.name }}</span>
                            <img
                              class="option__image"
                              :src="props.option.icon_url"
                              :alt="props.option.name "
                            />
                          </template>
                        </multiselect>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bdrm__img mb-4">
                  <div v-if="selectedImages.length < 1 && imgError">
                    <p class="error">You haven't add any image for this bedroom</p>
                  </div>

                  <div
                    class="d-flex w-100 flex-wrap"
                    v-if="!isSuccess || uploadedFiles.length <= 0"
                  >
                    <p class="form__label mr-auto">Upload Bedroom images</p>
                    <form enctype="multipart/form-data" novalidate>
                      <label class="form__add d-block ml-auto mb-0 text-right">
                        <span
                          v-if="!isSuccess || uploadedFiles.length <= 0"
                          class="float-left form__add"
                        >+Add</span>
                        <input
                          type="file"
                          multiple
                          :name="uploadFieldName"
                          @change="
                            filesChange(
                              $event.target.name,
                              $event.target.files
                            );
                            fileCount = $event.target.files.length;
                          "
                          accept="image/*"
                          class="input-file picture__more"
                        />
                      </label>
                    </form>
                  </div>
                  <p v-if="isSaving">Uploading {{ fileCount }} images...</p>

                  <!--SUCCESS-->
                  <div v-if="isSuccess" class="picture__upload-success d-flex flex-wrap w-100">
                    <p class="form__label mr-auto">Upload Bedroom images</p>
                  </div>

                  <!-- FAILED -->
                  <div v-if="isFailed">
                    <h2>Uploaded failed.</h2>
                    <p>
                      <a href="javascript:void(0)" @click="reset()">Try again</a>
                    </p>
                    <pre>{{ uploadError }}</pre>
                  </div>

                  <div class="row mx-0">
                    <div
                      class="col-lg-4 col-sm-6 mb-3"
                      v-for="(item, index) in selectedImages"
                      :key="index"
                    >
                      <div class="picture__upload-list">
                        <div
                          class="bdrm__img-list"
                          :style="{ backgroundImage: 'url(' + item + ')' }"
                          :id="index"
                        >
                          <div class="bdrm__img-delete" @click="deleteImage(index)">
                            <svgicon icon="cancel" class="bdrm__img-delete-icon"></svgicon>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form
                    v-if="isSuccess"
                    v-show="uploadedFiles.length >= 1"
                    enctype="multipart/form-data"
                    novalidate
                  >
                    <label class="form__add d-block ml-auto mb-0 text-right">
                      <span class="float-left form__add">+Add</span>
                      <input
                        type="file"
                        multiple
                        :name="uploadFieldName"
                        @change="
                            addChange($event.target.name, $event.target.files);
                            fileCount = $event.target.files.length;
                          "
                        accept="image/*"
                        class="input-file picture__more"
                      />
                    </label>
                  </form>
                </div>

                <div class="ml-auto mt-5" style="width:fit-content;">
                  <button
                    type="submit"
                    class="alt__btn"
                  >{{ bedroom.id == "" ? `Save` : `Update` }} Room</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="rooms">
        <div class="bdrm__empty" v-if="rooms.length < 1">Rooms you add will show up here.</div>
      </div>
      <p class="error" v-show="empty">You haven't added any bedroom</p>

      <div class="bdrm__preview">
        <div class="bdrm__preview-individual" v-for="(room, id) in rooms" :key="id">
          <div class="bdrm__preview-detail">
            <div
              class="bdrm__preview-image"
              :style="{ backgroundImage: 'url(' + room.ImageTags[0].img_url + ')' }"
            ></div>
            <div class="bdrm__preview-info">
              <p class="bdrm__preview-name">{{ room.name }}</p>
              <p
                class="bdrm__preview-masterbed"
                v-if="room.is_master_bedroom"
              >{{ room.is_master_bedroom ? "MasterBed" : "" }}</p>
              <p class="bdrm__preview-bathroom">{{ room.BathroomType.name }}</p>
            </div>
          </div>

          <div class="bdrm__preview-action">
            <div class="bdrm__preview-action-wrap">
              <button type="button" class="bdrm__preview-edit" @click="editRoom(room.id)">Edit</button>
              <button
                type="button"
                class="bdrm__preview-delete"
                @click="deleteModalShow(room.name, room.id)"
              >Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="step">
      <div class="step__wrap">
        <div class="step__prev">
          <button type="button" class="alt__btn" v-show="level > 1" @click="decrementLevel">Previous</button>
        </div>
        <button type="button" class="step__next cta__btn" @click="nextTab">Next</button>
      </div>
    </div>
  </div>
</template>
<script>
import Multiselect from "vue-multiselect";
import { required } from "vuelidate/lib/validators";
import {
  getRooms,
  addRoom,
  getBathrooms,
  updateRoom,
  roomImage,
  roomAmenities,
  deleteRoom,
  saveAndExit
} from "../../../services/listing";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  name: "bedroom",
  components: {
    Multiselect
  },
  data() {
    return {
      bathrooms: [],
      bathroomInfo: "",
      rooms: null,
      bedroom: {
        name: "",
        BathroomTypeId: null,
        is_master_bedroom: false,
        amenities: [],
        images: "",
        id: ""
      },
      bathroomValue: null,
      bedroomAmenities: [],
      isHidden: false,
      numBedroom: 1,
      modalTitle: "What type of furnishing is in Bedroom ",
      modalSubtitle: "Select furnishings you have in bedroom ",
      name: "bedroom",
      amenities: [],
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "image",
      selectedType: [],
      imageSelect: [],
      formData: "",
      bedroomForm: true,
      submitted: false,
      imgError: false,
      amenitiesError: false,
      addRoomBtn: true,
      studio: false,
      empty: false,
      listingId: this.$route.params.id,
      roomCounts: null,
      roomEditProgress: false,
      selectedImages: [],
      disableMasterBed: false
    };
  },
  validations: {
    bathroomValue: {
      required
    },
    bedroomAmenities: {
      required
    },
    bedroom: {
      name: {
        required
      }
    }
  },
  methods: {
    bathroomSelect(option) {
      this.bedroom.BathroomTypeId = option.id;
      this.bathroomInfo = option.description;
    },
    deleteModalShow(name, id) {
      this.$modal.show("dialog", {
        title: "Warning!!!",
        text: "Are you sure you want to delete " + name.bold(),
        buttons: [
          {
            title: "Yes",
            handler: () => {
              this.deleteRoom(id);
              this.$modal.hide("dialog");
            },
            class: "cta__btn vue-dialog_btn"
          },
          {
            title: "No",
            class: "alt__btn vue-dialog_btn"
          }
        ]
      });
    },
    nextTab() {
      if (this.rooms.length == 0) {
        return (this.empty = true);
      } else {
        this.empty = false;
        this.incrementLevel();
        this.continueFromRoom();
      }
    },
    checkMasterBed() {
      if (this.rooms != null) {
        let masterStatus = this.rooms.find(x => x.is_master_bedroom == true);

        if (masterStatus.is_master_bedroom == true) {
          this.disableMasterBed = true;
        }
      }
    },
    handleSubmit(e) {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.bedroomForm = false;
      this.submitData();
      this.resetForm();
    },
    passAmenities() {
      var i;
      this.bedroom.amenities = [];
      for (i = 0; i < this.bedroomAmenities.length; i++) {
        this.bedroom.amenities.push(this.bedroomAmenities[i].id);
      }
    },
    async getRoomAmenities() {
      await roomAmenities().then(data => {
        const roomAmenitiesData = data.data.data;
        this.amenities = roomAmenitiesData.Amenities;
      });
    },
    async deleteRoom(roomId) {
      const roomDelete = this.rooms.find(({ id }) => id == roomId);
      await deleteRoom(roomDelete.uuid)
        .then(data => {
          this.rooms = data.data.Rooms;
          // if (data.data.success) {
          //   this.deleteModalHide();
          // }
        })
        .catch(function(err) {
          throw err;
        });
    },
    async submitData() {
      if (this.roomEditProgress) {
        this.updateRoom();
      } else {
        await addRoom(
          this.listingId,
          this.bedroom.is_master_bedroom,
          this.bedroom.BathroomTypeId,
          this.bedroom.amenities,
          this.selectedImages,
          this.bedroom.name
        ).then(
          data => {
            if (data.success) {
              this.rooms = data.data.Rooms;
              this.returnRooms();
            } else {
              alert(data.error);
            }
          },
          error => {}
        );
      }
    },
    async updateRoom() {
      await updateRoom(
        this.bedroom.uuid,
        this.bedroom.is_master_bedroom,
        this.bedroom.BathroomTypeId,
        this.bedroom.amenities,
        this.selectedImages,
        this.bedroom.name
      ).then(
        data => {
          if (data.data.success) {
            this.bedroomForm = false;
            this.rooms = data.data.data.Rooms;
            this.returnRooms();
          } else {
            this.bedroomForm = true;
          }
        },
        error => {}
      );
    },
    editRoom(selectedId) {
      this.selectedImages = [];
      this.bedroomForm = true;
      this.roomEditProgress = true;
      const selectedRoom = this.rooms.find(({ id }) => id == selectedId);
      this.bedroom = selectedRoom;
      this.bedroomAmenities = this.bedroom.Amenities;
      this.bathroomValue = this.bedroom.BathroomType;
      this.bathroomInfo = this.bedroom.BathroomType.description;

      var i = 0;
      for (i = 0; i < this.bedroom.ImageTags.length; i++) {
        this.selectedImages.push(this.bedroom.ImageTags[i].img_url);

        // if (
        //   this.selectedImages.includes(this.bedroom.ImageTags[i].img_url) ===
        //   false
        // ) {
        //   this.selectedImages.push(this.bedroom.ImageTags[i].img_url);
        // }
      }
    },
    resetForm() {
      this.bedroom = {
        id: "",
        BathroomTypeId: "",
        is_master_bedroom: false,
        amenities: [],
        images: "",
        name: ""
      };
      this.uploadedFiles = [];
      this.bedroomAmenities = [];
      this.selectedImages = [];
      this.bathroomValue = null;
      this.bathroomInfo = null;
    },
    async getBathrooms() {
      await getBathrooms().then(data => {
        this.bathrooms = data.data.data;
      });
    },
    showForm() {
      this.selectedImages = [];
      this.bedroomForm = true;
      this.bedroomCountIncrement();
      this.checkMasterBed();
      this.bedroomAmenities = [];
      this.submitted = false;
      this.currentStatus = STATUS_INITIAL;
    },
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
    saveRoom() {
      if (this.selectedImages.length > 0) {
        this.bedroom.images = this.selectedImages;
        this.empty = false;
        if (this.onlyOneBed == true) {
          this.studio = true;
        }
        this.passAmenities();
        this.handleSubmit();
      } else {
        this.handleSubmit();
        this.imgError = true;
      }
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
    async returnRooms() {
      await getRooms(this.listingId).then(data => {
        const RoomsReturned = data.data.data;
        this.rooms = RoomsReturned.Rooms;
        this.$store.state.selectedSpaceType = RoomsReturned.space_type;

        if (RoomsReturned.space_type == "shared") {
          this.$store.commit("updateSpaceType", "Co-sharing Space");
        } else if (RoomsReturned.space_type == "studio") {
          this.$store.commit(
            "updateSpaceType",
            "Studio or Self Contained Space"
          );
        } else if (RoomsReturned.space_type == "entire") {
          this.$store.commit("updateSpaceType", "Entire Unit");
        }
      });
    },
    async continueFromRoom() {
      await saveAndExit(
        this.listingId,
        this.$store.getters.level,
        this.$store.getters.step
      ).then(
        data => {
          return data;
        },
        error => {}
      );
    }
  },
  computed: {
    level() {
      return this.$store.getters.level;
    },
    bedroomCount() {
      return this.$store.getters.bedroomCount;
    },
    spaceType() {
      return this.$store.state.selectedSpaceType;
    },
    onlyOneBed() {
      return this.$store.state.onlyOneBed;
    },
    newModalTitle() {
      return this.modalTitle;
    },
    newModalSubtitle() {
      return this.modalSubtitle;
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
    this.resetForm();
    this.getBathrooms();
    this.returnRooms();
    this.getRoomAmenities();
    this.checkMasterBed();
    this.submitted = false;
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
