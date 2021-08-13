<template>
  <div class="token-input">
    <div class="token-input__inner-box token-input__full-flex token-input__scrollable-x">
      <SearchOutlined class="token-input__search-icon" />
      <div class="token-input__tokens-ctn">
        <div class="token-input__token-item" v-for="token in tokens" :key="token.key">
          <span>{{token.displayKey}} : &nbsp;</span>
          <span v-if="!token.value || !token.value.optionComponent">{{token.value && token.value.label}}</span>
          <component v-else :is="token.value.optionComponent" :data="token.value.data"></component>
          <CloseOutlined class="token-input__token-item__close-icon" @click="removeToken(token.key)" />
        </div>
      </div>
      <a-auto-complete
        class="token-input__auto-complete"
        v-model:value="autocompleteValue"
        allow-clear
        :default-active-first-option="false"
        @search="onSearch"
        @select="onSelect"
      >
        <template #dataSource>
          <a-select-option v-for="option in options" :key="option.value">
            <div v-if="!option.optionComponent">
              {{ option.label }}
            </div>
            <component v-else :is="option.optionComponent" :data="option.data"></component>
          </a-select-option>
        </template>
         <a-input
          ref="autocomplete"
          :placeholder="placeholder"
          v-model="autocompleteValue"
          @pressEnter="handlePressEnter"
        />
      </a-auto-complete>
    </div>
    <div class="token-input__inner-box token-input__sort-ctn">
      <a-select
        :bordered="false"
        v-model:value="sortField"
        :placeholder="$t('USERS.TOKEN_INPUT.SORT_BY')"
        @change="handleSort"
      >
        <a-select-option v-for="sortOption in sortOptions" :key="sortOption.key" :value="sortOption.key">{{ $t(sortOption.label) }}</a-select-option>
      </a-select>
      <component
        v-if="sortField"
        class="token-input__sort-order-icon"
        :is="sortOrder === 'ascend' ? 'SortAscendingOutlined' : 'SortDescendingOutlined'"
        @click="toggleSortOrder"
      />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, SetupContext, ref, computed, Component } from 'vue';
import { SearchOutlined, CloseOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons-vue';

interface FilterOption {
  key: string;
  displayKey: string;
  options?: Option[];
  isDefaultToken: boolean;
  asyncAutocomplete?: (text: string) => Promise<Option[]>;
}

interface SortOption {
  key: string;
  label: string;
  default?: boolean;
}

interface TokenInputProps {
  filterOptions: FilterOption[];
  sortOptions: SortOption[];
  placeholder: string;
}

interface Option {
  value: string | boolean;
  label: string;
  optionComponent?: Component;
  data?: object;
}

interface Token {
  key: string;
  displayKey: string;
  value?: Option;
}

interface CustomHTMLElement extends HTMLElement {
  focus: () => void;
}

export interface Filter {
  [key: string]: string | boolean | undefined;
}

const SORT_DIRECTIONS = {
  ASC: 'ascend',
  DESC: 'descend'
};

export default defineComponent({
  name: 'TokenInput',
  components: {
    SearchOutlined,
    CloseOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined
  },
  props: {
    filterOptions: {
      type: Array as PropType<Array<FilterOption>>,
      default: () => []
    },
    sortOptions: {
      type: Array as PropType<Array<SortOption>>,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  setup (props: TokenInputProps, { emit }: SetupContext) {
    const autocompleteValue = ref<string>('');
    const autocomplete = ref<CustomHTMLElement | null>(null);
    const tokens = ref([] as Token[]);
    const selectedOption = ref<FilterOption | undefined>(undefined);
    const defaultSortField = props.sortOptions.find(option => option.default);
    const sortField = ref<string | undefined>(defaultSortField && defaultSortField.key);
    const sortOrder = ref<string>(SORT_DIRECTIONS.DESC);

    const initialOptions = props.filterOptions.filter(option => !option.isDefaultToken).map(option => ({
      value: option.key,
      label: option.displayKey
    }));

    const filterTypeOptions = ref<Option[]>(initialOptions);

    const options = computed(() => {
      if (selectedOption.value) {
        if (selectedOption.value.asyncAutocomplete) {
          return selectedOption.value.options || [];
        } else {
          return selectedOption.value && selectedOption.value.options ? selectedOption.value.options.map(option => {
            if (typeof option.value === 'boolean') {
              option.value = option.value ? 'true' : 'false';
            }

            return option;
          }) : [];
        }
      } else {
        return filterTypeOptions.value;
      }
    });

    let lastValueOfAutocomplete = '';

    async function fetchAsyncData (text: string) {
      if (selectedOption.value && selectedOption.value.asyncAutocomplete) {
        const filteredOptions = await selectedOption.value.asyncAutocomplete(text);
        selectedOption.value.options = filteredOptions;
      }
    }

    function focusToInput () {
      setTimeout(() => {
        if (autocomplete.value) {
          autocomplete.value.focus();
        }
      }, 0);
    }

    function reset () {
      setTimeout(() => {
        autocompleteValue.value = '';
        selectedOption.value = undefined;
        filterTypeOptions.value = initialOptions;
        lastValueOfAutocomplete = '';
        focusToInput();
      }, 0);
    }

    function createToken (type: string) {
      selectedOption.value = props.filterOptions.find(option => option.key === type);

      if (selectedOption.value) {
        const newToken: Token = {
          key: type,
          displayKey: selectedOption.value.displayKey
        };

        tokens.value = [...(tokens.value.filter(token => token.key !== type)), newToken];

        setTimeout(() => {
          autocompleteValue.value = selectedOption.value && selectedOption.value.isDefaultToken ? lastValueOfAutocomplete : '';
          fetchAsyncData(autocompleteValue.value);
          focusToInput();
        }, 0);
      }
    };

    function updateToken (type: string, value: string) {
      const selectedValue = options.value.find(option => option.value === value);
      tokens.value = tokens.value.map(token => {
        if (token.key === type) {
          token.value = selectedValue || { value, label: value };
        }

        return token;
      });
    }

    function removeToken (type: string) {
      tokens.value = tokens.value.filter(token => token.key !== type);
      if (selectedOption.value && selectedOption.value.key === type) {
        reset();
      } else {
        focusToInput();
      }
    }

    const onSearch = async (text: string) => {
      lastValueOfAutocomplete = text;

      if (selectedOption.value && selectedOption.value.asyncAutocomplete) {
        const filteredOptions = await selectedOption.value.asyncAutocomplete(text);
        selectedOption.value.options = filteredOptions;
      } else {
        const filteredOptions = text ? initialOptions.filter(option => {
          return option.label.toUpperCase().includes(text.toUpperCase());
        }) : initialOptions;

        filterTypeOptions.value = filteredOptions;
      }
    };

    const submit = () => {
      const filters: Filter = {};
      tokens.value.forEach(token => {
        if (token.key && token.value && token.value.value !== undefined) {
          if (token.value.value === 'true') {
            token.value.value = true;
          }

          if (token.value.value === 'false') {
            token.value.value = false;
          }

          filters[token.key] = token.value.value;
        }
      });

      emit('submit', {
        filters,
        sort: sortField.value ? {
          field: sortField.value,
          order: sortOrder.value
        } : undefined
      });
    };

    const handlePressEnter = () => {
      if (selectedOption.value) {
        if (autocompleteValue.value) {
          updateToken(selectedOption.value.key, autocompleteValue.value);
          reset();
        }
      } else if (!autocompleteValue.value) {
        submit();
      } else {
        const defaultToken = props.filterOptions.find(option => option.isDefaultToken);

        if (defaultToken) {
          createToken(defaultToken.key);
          updateToken(defaultToken.key, autocompleteValue.value);
          setTimeout(() => {
            autocompleteValue.value = '';
          }, 0);
          submit();
        }
      }
    };

    const onSelect = (val: string) => {
      if (!selectedOption.value) {
        createToken(val);
      } else {
        handlePressEnter();
      }
    };

    const handleSort = () => {
      submit();
    };

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === SORT_DIRECTIONS.ASC ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC;
      submit();
    };

    return {
      options,
      autocompleteValue,
      sortField,
      sortOrder,
      autocomplete,
      filterTypeOptions,
      tokens,
      removeToken,
      onSearch,
      onSelect,
      handlePressEnter,
      handleSort,
      toggleSortOrder
    };
  }
});
</script>

<style lang="less">
  .token-input {
    padding: 10px 20px;
    background: @token-input-outer-bg;
    box-shadow: @token-input-shadow;
    display: flex;

    &__inner-box {
      display: flex;
      align-items: center;
      background: @token-input-inner-bg;
      border-radius: 4px;
      padding: 10px;
    }

    &__scrollable-x {
      overflow-x: auto;
      overflow-y: visible;
    }

    &__full-flex {
      flex: 1;
    }

    &__sort-ctn {
      margin-left: 20px;

      .ant-select-borderless {
        padding-left: 15px;
        width: 160px;

        .ant-select-arrow {
          right: auto;
          left: 11px;
        }

        .ant-select-selection-item {
          padding-right: 0px;
        }
      }
    }

    &__sort-order-icon {
      font-size: 20px;
      cursor: pointer;
      color: @primary-color;
    }

    &__tokens-ctn {
      display: flex;
    }

    &__search-icon {
      font-size: 18px;
      color: @text-color-secondary;
      margin-right: 10px;
    }

    &__token-item {
      background: @token-item-bg;
      border-radius: 2px;
      padding: 4px;
      box-shadow: @token-item-box-shadow;
      margin: 0px 10px;
      white-space: nowrap;
      transition: all 0.2s ease-in-out;
      display: flex;
      align-items: center;

      &__close-icon {
        margin-left: 10px;
        color: @text-color-secondary;
        cursor: pointer;
        display: none;

        &:hover {
          color: @text-color;
        }
      }

      &:hover {
        background: @token-item-hover-bg;
        box-shadow: @token-item-shadow;
      }

      &:hover > &__close-icon {
        display: block;
      }
    }

    &__auto-complete {
      flex: 1;
      min-width: 200px;

      input {
        border: 0px;
      }
    }
  }
</style>
