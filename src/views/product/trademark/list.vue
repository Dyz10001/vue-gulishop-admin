<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >

    <!-- 展示品牌表格 -->
    <el-table
      border
      ref="singleTable"
      :data="records"
      highlight-current-row
      style="width: 100%;margin:20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column property="tmName" label="品牌名称"> </el-table-column>
      <el-table-column property="logoUrl" label="品牌LOGO">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width:100px;height:60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <div>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="showUpdateDialog(row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleteDialog(row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="text-align:center"
      @size-change="sizeChange"
      @current-change="getPageList"
      :current-page="page"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="limit"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    >
    </el-pagination>

    <!-- 添加或修改对话框 -->
    <el-dialog title="添加品牌" :visible.sync="isShowDialog">
      <el-form :model="form" style="width:80%">
        <el-form-item label="品牌名称" :label-width="'100px'">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="'100px'">
          <template>
            <el-upload
              class="avatar-uploader"
              action="/dev-api/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      form: {
        tmName: "",
        logoUrl: ""
      },
      records: [],
      page: 1,
      limit: 3,
      total: 1,
      isShowDialog: false
    };
  },
  methods: {
    //获取品牌的列表
    async getPageList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(page, this.limit);
      if (result.code === 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },

    //点击添加按钮，显示添加/修改品牌对话框
    showAddDialog() {
      this.form = {
        logoUrl: "",
        tmName: ""
      };
      this.isShowDialog = true;
    },

    //更改分页显示数量
    sizeChange(size) {
      this.limit = size;
      this.getPageList();
    },

    //upload照片上传成功之后
    handleAvatarSuccess(res, file) {
      this.form.logoUrl = res.data;
    },

    //upload照片上传之前
    beforeAvatarUpload(file) {
      const imgTypeList = ["image/jpeg", "image/png", "image/gif"];
      const isJPGOrPNG = imgTypeList.indexOf(file.type) !== -1;
      const isLt500K = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt500K) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGOrPNG && isLt500K;
    },

    //添加或修改品牌
    async save() {
      const trademark = this.form;
      try {
        const result = await this.$API.trademark.addOrUpdate(trademark);
        if (result.code === 200) {
          this.isShowDialog = false;
          this.$message.success(`${trademark.id ? "修改" : "添加"}品牌成功`);
          this.getPageList(trademark.id ? this.page : 1);
        } else {
          this.$message.danger("添加品牌失败，请联系管理员");
        }
      } catch (error) {
        this.$message.danger("网络连接失败");
      }
    },

    //显示修改对话框按钮
    showUpdateDialog(row) {
      this.isShowDialog = true;

      this.form = { ...row };
    },

    //显示删除对话框
    showDeleteDialog(row) {
      this.$confirm(`确认删除${row.tmName}吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const result = await this.$API.trademark.delete(row.id);
            if (result.code === 200) {
              this.$message.success("删除成功");
              this.getPageList(
                this.records.length > 1 ? this.page : this.page - 1
              );
            }
          } catch (error) {
            this.$message.danger(`删除失败 ${error.message}`);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    this.getPageList();
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
