<template>
<div>
  <main role="main" class="container">
    <vue-element-loading :active="loading" spinner="bar-fade-scale" color="#FF6700" :is-full-screen="true"/>
    <div class="d-flex justify-content-center align-items-center p-3 my-3 text-white-50 bg-purple rounded shadow-sm" style="background-color:#6f42c1;">
      <div class="lh-100">
        <h6 class="mb-0 text-white lh-100">Danh sách tài khoản</h6>
      </div>
    </div>

    <div class="my-3 p-3 bg-white rounded shadow-sm">
      <h6 class="mb-0">Tài khoản thanh toán</h6>
      <template v-if="cards.length">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Số tài khoản</th>
                <th scope="col">Số dư (VND)</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr :class="{ 'table-info' : index % 2 == 0, 'table-light': index % 2 == 1}" v-for="(card, index) in cards" :key="card.Id">
                <td>{{card.Id}}</td>
                <td>{{card.Money}}</td>
                <td>
                  <template v-if="card.IsClosed == 0">
                    Hoạt động <span><font-awesome-icon class="closeCard" :icon="['fa', 'backspace']" v-on:click="closeCard(card)"/></span>
                  </template>
                  <template v-else>
                    Đã đóng
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <h6 style="margin: auto;" class="text-center">Bạn chưa có tài khoản nào!</h6>            
      </template>
    </div>
  </main>
</div>
</template>

<script>
var api = require('../utils/api.js');
import VueElementLoading from 'vue-element-loading';

export default {
  name: 'Card',
  created() {
    // get all card before create
    this.fetchCard();
  },
  components: {
    VueElementLoading  // loading page
  },
  data () {
    return {
      loading: false, // used to init loading state (css, image) for entire page (full screen)
      cards: [] // list cards
    }
  },
  methods: {
    // get all card
    fetchCard() {
      this.loading = true; // loading entire page
      this.cards = [];
      // call api
      api.getCard().then(res => {
        this.cards = res.data;
        setTimeout(() => this.loading = false, 1000); // finish loading after 1s
      }).catch(err => {
        console.log(err);
        setTimeout(() => this.loading = false, 1000); // finish loading after 1s
      })
    },
    // close card by id
    closeCard(card) {
      // check money
      if (card.Money > 0) {
        var that = this;
        this.$dialog.alert('Vui lòng chuyển toàn bộ số dư trước khi đóng tài khoản!').then(function(dialog) { 
          that.$router.push({name: 'transaction', params: {card: card}})
        });
      } else {
        let message = {
            title: 'Bạn có muốn đóng tài khoản này không?',
            body: `Số tài khoản: ${card.Id}`
        }
        var that = this;
        var clone = this.$dialog;
        this.$dialog.confirm(message, {loader: true}).then(function(dialog) { 
          api.closeCard(card.Id).then(res => {
            that.fetchCard();
            dialog.loading(false);
            clone.alert('Đóng tài khoản thành công').then(function(d) { 
              console.log('Success');
            });
            dialog.close();
          }).catch(err => {
            var msg = 'Đóng tài khoản không thành công, vui lòng thử lại sau!';
            var status = err.response.status;
            if (status == 409) {
              msg = 'Không thể đóng tài khoản cuối cùng!';
            }
            dialog.loading(false);
            dialog.close();
            clone.alert(msg).then(function(d) { 
              console.log(status);
            });
          })
        }).catch(function() {
            console.log('Clicked on cancel');
        });
      }
    }
  }
}
</script>

<style>
a {
  cursor: pointer;
}

a:hover {
  color: #5672f9;
}

.closeCard {
  cursor: pointer;
}
</style>

