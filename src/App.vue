<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div class="app-container">
        <div class="filter-container">
          <el-row>
            <el-col :span="24">
              <el-input
                v-model="listQuery.ClientId"
                placeholder="Client ID"
                style="width: 200px"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
              <el-input
                v-model="listQuery.EstateID"
                placeholder="Estate ID"
                style="width: 200px"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
              <el-select
                v-model="categoriesList"
                multiple
                clearable
                placeholder="Category"
                style="width: fit-content"
                class="filter-item"
              >
                <el-option v-for="(item, key) in categories" :key="key" :label="item" :value="key" />
              </el-select>
              <el-select
                v-model="listQuery.Language"
                placeholder="Language"
                style="width: 120px"
                class="filter-item"
              >
                <el-option v-for="(item, key) in languages" :key="key" :label="item" :value="item" />
              </el-select>
              <el-select
                v-model="listQuery.CountryID"
                placeholder="Country"
                style="width: 120px"
                class="filter-item"
              >
                <el-option
                  v-for="(item, key) in countries"
                  :key="key"
                  :label="item.Name"
                  :value="item.CountryId"
                />
              </el-select>
              <el-select
                v-model="purposesList"
                multiple
                clearable
                placeholder="Purpose"
                style="width: fit-content"
                class="filter-item"
              >
                <el-option v-for="(item, key) in purposes" :key="key" :label="item" :value="key" />
              </el-select>

              <el-select
                v-model="statusesList"
                style="width: fit-content"
                class="filter-item"
                multiple
                clearable
                placeholder="Status"
              >
                <el-option v-for="(item, key) in statuses" :key="key" :label="item" :value="key"></el-option>
              </el-select>
              <el-select
                v-model="displayStatusesList"
                style="width: fit-content"
                class="filter-item"
                multiple
                clearable
                placeholder="Display status"
              >
                <el-option
                  v-for="(item, key) in displayStatusList"
                  :key="key"
                  :label="item"
                  :value="key"
                ></el-option>
              </el-select>
              <el-checkbox
                v-model="listQuery.ShowDetails"
                :checked="listQuery.ShowDetails?'checked':''"
                class="filter-item"
                style="margin-left:15px"
              >With details</el-checkbox>
              <el-button
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleFilter"
              >Get</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="Estate ID" prop="EstateID" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.EstateID }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Name" :min-width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.Name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Country" align="center" :min-width="40">
            <template slot-scope="scope">
              <span>{{ scope.row.Country }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Category" align="center" :min-width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.Category }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Purpose" align="center" :min-width="40">
            <template slot-scope="scope">
              <span v-for="(item, key) in scope.row.Purposes" :key="key">{{ item.Name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Price" width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.Price }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="Status" align="center" :min-width="40">
            <template slot-scope="scope">
              <el-tag :type="scope.row.StatusId | statusClass">{{ scope.row.StatusId | statusName }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.Page"
          :limit.sync="listQuery.RowsPerPage"
          @pagination="getList"
        />
      </div>
    </transition>
  </section>
</template>

<script>
import { getEstateList, fetchLanguages, fetchCountries } from "./api";
import Pagination from "@/components/Pagination";
const defaultListQuery = {
  ClientId: "-184152565",
  Page: 0,
  CountryID: 30,
  RowsPerPage: 10,
  StatusIDList: [],
  DisplayStatusIdList: [],
  PurposeIDList: [1],
  CategoryIDList: [1],
  Language: "en-GB",
  ShowDetails: "true",
  ShowRepresentatives: 1,
  OrderByFields: ["EstateID DESC"]
};

export default {
  name: "app",
  components: { Pagination },
  filters: {
    statusClass(status) {
      const statusClass = {
        1: "success",
        5: "info",
        6: "danger"
      };
      return statusClass[status];
    },
    statusName(status) {
      const statusName = {
        5: "archived",
        1: "active",
        6: "deleted"
      };
      return statusName[status];
    }
  },
  data() {
    return {
      total: 0,
      listLoading: true,
      categories: {
        1: "house",
        2: "apartment",
        3: "ground",
        4: "office",
        5: "commercial",
        6: "industry",
        7: "garage"
      },
      purposes: {
        1: "for sale",
        2: "for rent",
        3: "life annuity sale"
      },
      statuses: {
        5: "archived",
        1: "active",
        6: "deleted"
      },
      displayStatusList: {
        1: "offline",
        2: "online",
        3: "estate of the month",
        4: "realization"
      },
      list: [],
      languages: [],
      countries: [],
      listQuery: Object.assign({}, defaultListQuery)
    };
  },
  computed: {
    statusesList: {
      get() {
        const filtered = Object.keys(this.statuses).filter(key =>
          this.listQuery.StatusIDList.includes(parseInt(key))
        );
        return filtered;
      },
      set(val) {
        this.listQuery.StatusIDList = val.map(el => parseInt(el));
      }
    },
    displayStatusesList: {
      get() {
        const filtered = Object.keys(this.displayStatusList).filter(key =>
          this.listQuery.DisplayStatusIdList.includes(parseInt(key))
        );
        return filtered;
      },
      set(val) {
        this.listQuery.DisplayStatusIdList = val.map(el => parseInt(el));
      }
    },
    categoriesList: {
      get() {
        const filtered = Object.keys(this.categories).filter(key =>
          this.listQuery.CategoryIDList.includes(parseInt(key))
        );
        return filtered;
      },
      set(val) {
        this.listQuery.CategoryIDList = val.map(el => parseInt(el));
      }
    },
    purposesList: {
      get() {
        const filtered = Object.keys(this.purposes).filter(key =>
          this.listQuery.PurposeIDList.includes(parseInt(key))
        );
        return filtered;
      },
      set(val) {
        this.listQuery.PurposeIDList = val.map(el => parseInt(el));
      }
    }
  },
  mounted() {},
  created() {
    this.getLanguages();
    this.getCountries();
    this.getList();
  },
  methods: {
    getCountries() {
      this.listLoading = true;
      fetchCountries(this.listQuery.Language).then(response => {
        this.countries = response.data["d"]
          ? response.data["d"]["CountryList"]
          : response.data;
        this.listLoading = false;
      });
    },
    getList() {
      this.listLoading = true;
      getEstateList(this.listQuery).then(response => {
        this.list = response.data["d"]
          ? response.data["d"]["EstateList"]
          : response.data;
        this.total =
          response.data["d"] && response.data["d"]["QueryInfo"]["Success"]
            ? parseInt(response.data["d"]["QueryInfo"]["RowCount"])
            : this.total;
        this.listLoading = false;
      });
    },
    getLanguages() {
      this.listLoading = true;
      fetchLanguages().then(response => {
        this.languages = response.data["d"]
          ? [...new Set(response.data["d"]["LanguageList"])]
          : response.data;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.Page = 0;
      this.getList();
    }
  }
};
</script>
