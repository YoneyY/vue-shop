<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            :clearable="true"
            v-model="productSearch"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="productList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称">
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="100">
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="80">
          </el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="120">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getProductInfo();
  },
  data() {
    return {
      productSearch: "",
      product: {
        query: "",
        pagenum: "1", // 当前页码
        pagesize: "5" // 每页显示多少条
      },
      productList: []
    };
  },
  methods: {
    async getProductInfo() {
      const { data: ret } = await this.$http.get("goods", {
        params: this.product
      });
      console.log(ret);
      if (ret.meta.status != 200) {
        return this.$message.error(ret.meta.msg);
      }
      this.productList = ret.data.goods;
    }
  }
};
</script>

<style lang="less" scoped></style>
