<template>
  <div class="register">
    <div class="register__overlay">
      <div class="register__form">
        <router-view></router-view>
        <div class="register__text">Explore the joys of easier living.</div>
      </div>
      <!-- <div class="register__carousel">
      <swiper :options="swiperOption">
        <swiper-slide>
          <div
            class="register__slide"
            :style="{'background-image': 'url(' + require('./assets/images/bedroom_slide.jpg') + ')'}"
          >
            <div class="register__slide-overlay">
              <div class="register__slide-info">
                <h3 class="register__slide-head">Fully Furnished Apartment</h3>
                <p
                  class="register__slide-text"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
              </div>
            </div>
          </div>
        </swiper-slide>

        <swiper-slide>
          <div
            class="register__slide"
            :style="{'background-image': 'url(' + require('./assets/images/community.jpg') + ')'}"
          >
            <div class="register__slide-overlay">
              <div class="register__slide-info">
                <h3 class="register__slide-head">Community</h3>
                <p
                  class="register__slide-text"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
              </div>
            </div>
          </div>
        </swiper-slide>

        <swiper-slide>
          <div
            class="register__slide"
            :style="{'background-image': 'url(' + require('./assets/images/living-room.jpg') + ')'}"
          >
            <div class="register__slide-overlay">
              <div class="register__slide-info">
                <h3 class="register__slide-head">Easier Living</h3>
                <p
                  class="register__slide-text"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  components: {},
  data() {
    return {
      swiperOption: {
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      }
    };
  },
  methods: {}
};
</script>
