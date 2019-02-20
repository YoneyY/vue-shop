<template>
  <div class="welcome">
    <!-- <img src="../assets/img/back.png" alt="back"> -->
    <h1>Welcome</h1>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.welcome {
  background: url("../assets/img/back.png") no-repeat center;
  width: 100%;
  height: 100%;
  text-align: center;
  position: relative;
  margin: 0;
  padding: 0;
  h1 {
    font-size: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
