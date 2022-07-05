<template>
  <div class="token-input">
    <div class="token-input__inner-box token-input__full-flex token-input__scrollable-x">
      <SearchOutlined class="token-input__search-icon" />
      <div class="token-input__tokens-ctn">
        <div v-for="token in tokens" :key="token.key" class="token-input__token-item">
          <span>{{ token.displayKey }} : &nbsp;</span>
          <span v-if="!token.value || !token.value.optionComponent">{{ token.value && token.value.label }}</span>
          <component :is="token.value.optionComponent" v-else :data="token.value.data" />
          <CloseOutlined class="token-input__token-item__close-icon" @click="removeToken(token.key)" />
        </div>
      </div>
      <a-auto-complete
        v-model:value="autocompleteValue"
        class="token-input__auto-complete"
        allow-clear
        :default-active-first-option="false"
        :options="options"
        @search="onSearch"
        @select="onSelect"
      >
        <template #option="item">
          <div v-if="!item.optionComponent">
            <SearchOutlined v-if="item.default" />
            {{ item.label }}
          </div>
          <component :is="item.optionComponent.value" v-else :data="item.data" />
        </template>
        <a-input ref="autocomplete" :placeholder="placeholder" @keydown="handleKeyPress" />
      </a-auto-complete>
    </div>
    <div class="token-input__inner-box token-input__sort-ctn">
      <a-select
        v-model:value="sort.field"
        :bordered="false"
        :placeholder="$t('USERS.TOKEN_INPUT.SORT_BY')"
        @change="onSortChange"
      >
        <a-select-option v-for="s in sorts" :key="s.key" :value="s.key">
          {{ $t(s.label) }}
        </a-select-option>
      </a-select>
      <component
        :is="sort.order === SORT_ORDER.ASC ? 'SortAscendingOutlined' : 'SortDescendingOutlined'"
        v-if="sort.order"
        class="token-input__sort-order-icon"
        @click="toggleSortOrder"
      />
    </div>
    <div class="token-input__search-btn">
      <a-button type="primary" @click="submit()"> {{ $t('USERS.TOKEN_INPUT.SEARCH') }} </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref, computed, Component, ComputedRef } from 'vue';
import { SearchOutlined, CloseOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons-vue';
import Sort, { SORT_ORDER } from '@/core/types/Sort';
import Filters from '@/core/types/Filters';
interface Option {
  default?: boolean;
  value: string | boolean;
  label: ComputedRef<string> | string;
  optionComponent?: Component;
  data?: Record<string, unknown>;
}

interface FilterOption {
  key: string;
  displayKey: ComputedRef;
  options?: Option[];
  default?: boolean;
  asyncAutocomplete?: (text: string) => Promise<Option[]>;
}

interface SortOption {
  key: string;
  label: string;
  default?: boolean;
}

interface TokenInputProps {
  filters: FilterOption[];
  sorts: SortOption[];
  placeholder: string;
}

interface Token {
  key: string;
  displayKey: ComputedRef;
  value?: Option;
}

interface CustomHTMLElement extends HTMLElement {
  focus: () => void;
}

export interface TokenSubmitPayload<Filters> {
  filters: Filters;
  sort?: Sort;
}

export default defineComponent({
  name: 'TokenInput',
  components: {
    SearchOutlined,
    CloseOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
  },
  props: {
    filters: {
      type: Array as PropType<FilterOption[]>,
      default: () => [],
    },
    sorts: {
      type: Array as PropType<Array<SortOption>>,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: {
    submit: (payload: TokenSubmitPayload<Filters>) => payload,
  },
  setup(props: TokenInputProps, { emit }) {
    const autocompleteValue = ref('');
    const autocomplete = ref<CustomHTMLElement | null>(null);
    const tokens = ref<Token[]>([]);
    const selectedOption = ref<FilterOption | undefined>();
    const isPressArrowDown = ref(false);
    const defaultSortField = props.sorts.find((sort) => sort.default);
    const sort = reactive<Sort>({
      field: defaultSortField?.key || '',
      order: SORT_ORDER.ASC,
    });

    const tokenOptions = props.filters.map((filter) => ({
      default: filter.default,
      value: filter.key,
      label: filter.displayKey.value,
    }));

    const filteredTokenOptions = computed<Option[]>(() =>
      tokenOptions
        .filter(
          (option) =>
            option.default ||
            !autocompleteValue.value ||
            (autocompleteValue.value && option.label.toUpperCase().includes(autocompleteValue.value.toUpperCase()))
        )
        .sort((option) => (option.default ? 1 : -1))
    );

    const options = computed(() => {
      if (selectedOption.value) {
        if (selectedOption.value.asyncAutocomplete) {
          return selectedOption.value.options || [];
        } else {
          return (
            selectedOption.value.options?.map((option) => {
              if (typeof option.value === 'boolean') {
                option.value = option.value ? 'true' : 'false';
              }

              return option;
            }) || []
          );
        }
      } else {
        return filteredTokenOptions.value || [];
      }
    });

    let lastValueOfAutocomplete = '';

    async function fetchAsyncData(text: string) {
      if (selectedOption.value && selectedOption.value.asyncAutocomplete) {
        const filteredOptions = await selectedOption.value.asyncAutocomplete(text);
        selectedOption.value.options = filteredOptions;
      }
    }

    function focusToInput() {
      setTimeout(() => {
        if (autocomplete.value) {
          autocomplete.value.focus();
        }
      }, 0);
    }

    function reset() {
      setTimeout(() => {
        autocompleteValue.value = '';
        selectedOption.value = undefined;
        lastValueOfAutocomplete = '';
        focusToInput();
      }, 0);
    }

    function createToken(type: string) {
      selectedOption.value = props.filters.find((filter) => filter.key === type);

      if (selectedOption.value) {
        const newToken: Token = {
          key: type,
          displayKey: selectedOption.value.displayKey,
        };

        tokens.value = [...tokens.value.filter((token) => token.key !== type), newToken];

        setTimeout(() => {
          autocompleteValue.value = selectedOption.value?.default ? lastValueOfAutocomplete : '';

          fetchAsyncData(autocompleteValue.value);
          focusToInput();
        });
      }
    }

    function updateToken(type: string, value: string) {
      const selectedValue = options.value.find((option) => option.value === value);

      tokens.value = tokens.value.map((token) => {
        if (token.key === type) {
          token.value = selectedValue || { value, label: value };
        }

        return token;
      });
    }

    function removeToken(type: string) {
      tokens.value = tokens.value.filter((token) => token.key !== type);
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
      }
    };

    const submit = () => {
      const filters: Filters = {};

      tokens.value.forEach((token) => {
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

      emit('submit', { filters, sort });
    };

    const onPressEnter = () => {
      if (selectedOption.value) {
        if (autocompleteValue.value) {
          updateToken(selectedOption.value.key, autocompleteValue.value);
          reset();
        }
      } else if (!selectedOption.value && !autocompleteValue.value) {
        submit();
      } else if (!selectedOption.value && autocomplete.value && !isPressArrowDown.value) {
        const defaultToken = props.filters.find((filter) => filter.default);

        if (defaultToken) {
          createToken(defaultToken.key);
          updateToken(defaultToken.key, autocompleteValue.value);
          autocompleteValue.value = '';
          submit();
        }
        isPressArrowDown.value = false;
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'ArrowDown') {
        isPressArrowDown.value = true;
      }
      if (event.code === 'Enter') {
        onPressEnter();
      }
      if (autocompleteValue.value == '' && event.code === 'Backspace') {
        tokens.value.pop();
        selectedOption.value = undefined;
      } else if (autocompleteValue.value.length === 1 && event.code === 'Backspace' && selectedOption.value) {
        autocompleteValue.value = '';
        lastValueOfAutocomplete = '';
        focusToInput();
      }
    };

    const onSelect = (value: string) => {
      if (!selectedOption.value) {
        createToken(value);
      } else {
        onPressEnter();
      }
    };

    const onSortChange = () => {
      sort.order = sort.order || SORT_ORDER.DESC;

      submit();
    };

    const toggleSortOrder = () => {
      sort.order = sort.order === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;

      submit();
    };

    return {
      options,
      autocompleteValue,
      sort,
      autocomplete,
      tokens,
      submit,
      removeToken,
      onSearch,
      onSelect,
      onSortChange,
      toggleSortOrder,
      handleKeyPress,
      SORT_ORDER,
    };
  },
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

  &__search-btn {
    margin-left: 25px;

    .ant-btn {
      height: 100%;
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
