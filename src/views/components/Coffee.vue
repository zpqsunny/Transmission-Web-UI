<template>
  <v-container>
    <div class="d-flex flex-column">
      <div>
        Paypal: zpqsunny@gmail.com
      </div>
      <div>
        Alipay
        <img alt="give me a coffee" ref="alipay" src="#" height="164" width="164">
      </div>
      <div>
        WeChat Pay
        <img alt="give me a coffee" ref="wechat" src="#" height="164" width="164">
      </div>
    </div>
  </v-container>
</template>

<script>
import QRCode from "qrcode";

export default {
  name: 'Coffee',
  data() {
    return {

    }
  },
  mounted() {
    this.showQrcode()
  },
  methods: {
    showQrcode() {
      const alipay = 'https://qr.alipay.com/fkx13135odesmjp48zox141'
      const wechat = 'wxp://f2f0clTyGUBo_D7wtrlDg7TFa8y9SiIB86tW'
      QRCode.toDataURL(alipay, ((error, url) => {
        if (!error) {
          this.$refs['alipay'].src = url
        }
      }))
      QRCode.toDataURL(wechat, ((error, url) => {
        if (!error) {
          this.$refs['wechat'].src = url
        }
      }))
    }
  }
}
</script>

<style scoped>

</style>
