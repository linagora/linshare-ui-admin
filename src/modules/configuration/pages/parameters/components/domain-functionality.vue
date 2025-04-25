<script lang="ts" setup>
import { reactive, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import { Functionality } from '../types/Functionality';
import useFunctionalties from '../hooks/useFunctionalities';
import { updateFunctionality } from '../services/parameters-api';
import { useDomainStore } from '@/modules/domain/store';
import { APIError } from '@/core/types/APIError';

interface Props {
  data: Functionality;
}

const { t } = useI18n();
const domainStore = useDomainStore();
const { currentDomain } = storeToRefs(domainStore);
const { getTranslatedText } = useFunctionalties();
const props = defineProps<Props>();
const emits = defineEmits(['updated']);
const functionality = reactive<Functionality>(cloneDeep(props.data));
const collapsedKeys = ref(['parameter', 'activation', 'delegation', 'configuration']);
const saving = ref(false);

async function saveChanges() {
  try {
    saving.value = true;
    const updated = await updateFunctionality(currentDomain.value.uuid, functionality);
    emits('updated', updated);
  } catch (error) {
    if (error instanceof APIError) {
      message.error(error.getMessage());
    }
  } finally {
    saving.value = false;
  }
}

watchEffect(() => {
  if (props.data) {
    Object.assign(functionality, cloneDeep(props.data));
  }
});
</script>

<template>
  <div>
    <a-collapse v-model:activeKey="collapsedKeys">
      <a-collapse-panel
        v-if="data.activationPolicy && !data.activationPolicy.hidden"
        key="activation"
        :header="$t('FUNCTIONALITIES.DEFAULT.ACTIVATION_POLICY.HEADER')"
      >
        <p class="secondary-text">
          {{ getTranslatedText(functionality, 'ACTIVATION_POLICY.DESCRIPTION') }}
        </p>

        <div>
          <a-checkbox
            v-model:checked="functionality.activationPolicy.enable.value"
            :disabled="data.activationPolicy.readonly"
          >
            {{ getTranslatedText(functionality, 'ACTIVATION_POLICY.ENABLE_CHECKBOX_DESCRIPTION') }}
          </a-checkbox>
        </div>

        <div>
          <a-checkbox
            v-model:checked="functionality.activationPolicy.allowOverride.value"
            :disabled="data.activationPolicy.readonly"
          >
            {{ $t('FUNCTIONALITIES.DEFAULT.ACTIVATION_POLICY.OVERRIDE_CHECKBOX_DESCRIPTION') }}
          </a-checkbox>
        </div>
      </a-collapse-panel>

      <a-collapse-panel
        v-if="data.configurationPolicy && !data.configurationPolicy.hidden"
        key="configuration"
        :header="$t('FUNCTIONALITIES.DEFAULT.CONFIGURATION_POLICY.HEADER')"
      >
        <p class="secondary-text">
          {{ getTranslatedText(functionality, 'CONFIGURATION_POLICY.DESCRIPTION') }}
        </p>

        <div>
          <a-checkbox
            v-model:checked="functionality.configurationPolicy.enable.value"
            :disabled="data.configurationPolicy.readonly"
          >
            {{ $t('FUNCTIONALITIES.DEFAULT.CONFIGURATION_POLICY.ENABLE_CHECKBOX_DESCRIPTION') }}
          </a-checkbox>
        </div>

        <div>
          <a-checkbox
            v-model:checked="functionality.configurationPolicy.allowOverride.value"
            :disabled="data.configurationPolicy.readonly"
          >
            {{ $t('FUNCTIONALITIES.DEFAULT.CONFIGURATION_POLICY.OVERRIDE_CHECKBOX_DESCRIPTION') }}
          </a-checkbox>
        </div>
      </a-collapse-panel>

      <a-collapse-panel
        v-if="data.delegationPolicy && !data.delegationPolicy.hidden"
        key="delegation"
        :header="$t('FUNCTIONALITIES.DEFAULT.DELEGATION_POLICY.HEADER')"
      >
        <p class="secondary-text">
          {{ getTranslatedText(functionality, 'DELEGATION_POLICY.DESCRIPTION') }}
        </p>

        <div>
          <a-checkbox
            v-model:checked="functionality.delegationPolicy.enable.value"
            :disabled="data.delegationPolicy?.readonly"
          >
            {{ getTranslatedText(functionality, 'DELEGATION_POLICY.ENABLE_CHECKBOX_DESCRIPTION') }}
          </a-checkbox>
        </div>

        <div>
          <a-checkbox
            v-model:checked="functionality.delegationPolicy.allowOverride.value"
            :disabled="data.delegationPolicy?.readonly"
          >
            {{ $t('FUNCTIONALITIES.DEFAULT.DELEGATION_POLICY.OVERRIDE_CHECKBOX_DESCRIPTION') }}
          </a-checkbox>
        </div>
      </a-collapse-panel>
      <a-collapse-panel
        v-if="functionality.parameter && !functionality.parameter.hidden"
        key="parameter"
        :header="$t('FUNCTIONALITIES.DEFAULT.PARAMETER.HEADER')"
      >
        <a-form class="parameter-form" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
          <a-form-item
            v-if="functionality.parameter.type === 'STRING'"
            :label="getTranslatedText(functionality, 'PARAMETER.TITLE')"
            :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION')"
          >
            <a-input
              v-model:value="functionality.parameter.defaut.value"
              :disabled="data.parameter?.readonly"
            ></a-input>
          </a-form-item>

          <a-form-item
            v-if="functionality.parameter.type === 'INTEGER_DEFAULT'"
            :label="getTranslatedText(functionality, 'PARAMETER.TITLE')"
            :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION')"
          >
            <a-input
              v-model:value="functionality.parameter.defaut.value"
              type="number"
              :disabled="data.parameter?.readonly"
            ></a-input>
          </a-form-item>

          <a-form-item
            v-if="functionality.parameter.type === 'BOOLEAN'"
            :label="getTranslatedText(functionality, 'PARAMETER.TITLE')"
            :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION')"
          >
            <a-checkbox v-model:checked="functionality.parameter.defaut.value" :disabled="data.parameter?.readonly">
              {{ getTranslatedText(functionality, 'PARAMETER.BOOLEAN_DESCRIPTION') }}
            </a-checkbox>
          </a-form-item>

          <a-form-item
            v-if="functionality.parameter.type === 'UNIT_TIME_DEFAULT'"
            :label="getTranslatedText(functionality, 'PARAMETER.TITLE')"
            :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION')"
          >
            <a-input
              v-model:value="functionality.parameter.defaut.value"
              type="number"
              :disabled="data.parameter?.readonly"
            >
              <template #addonAfter>
                <a-select v-model:value="functionality.parameter.defaut.unit">
                  <a-select-option v-for="unit in functionality.parameter?.defaut.units" :key="unit" :value="unit">
                    {{ t(`FUNCTIONALITIES.UNITS.TIME.${unit}`) }}
                  </a-select-option>
                </a-select>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            v-if="functionality.parameter.type === 'UNIT_SIZE_MAX'"
            :label="getTranslatedText(functionality, 'PARAMETER.TITLE_MAXIMUM')"
            :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION_MAXIMUM')"
          >
            <a-checkbox
              v-if="functionality.parameter.unlimited.supported"
              v-model:checked="functionality.parameter.unlimited.value"
              class="unlimited-checkbox"
            >
              {{ getTranslatedText(functionality, 'PARAMETER.UNLIMITED_CHECKBOX') }}
            </a-checkbox>
            <a-input
              v-model:value="functionality.parameter.maximum.value"
              type="number"
              :disabled="data.parameter?.readonly || functionality.parameter.unlimited.value"
            >
              <template #addonAfter>
                <a-select v-model:value="functionality.parameter.maximum.unit" :disabled="data.parameter?.readonly">
                  <a-select-option v-for="unit in functionality.parameter?.maximum.units" :key="unit" :value="unit">
                    {{ t(`FUNCTIONALITIES.UNITS.SIZE.${unit}`) }}
                  </a-select-option>
                </a-select>
              </template>
            </a-input>
          </a-form-item>

          <div v-if="functionality.parameter.type === 'INTEGER_ALL'">
            <a-form-item
              :label="getTranslatedText(functionality, 'PARAMETER.TITLE')"
              :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION')"
            >
              <a-input
                v-model:value="functionality.parameter.defaut.value"
                type="number"
                :disabled="data.parameter?.readonly"
              ></a-input>
            </a-form-item>

            <a-form-item
              :label="getTranslatedText(functionality, 'PARAMETER.TITLE_MAXIMUM')"
              :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION_MAXIMUM')"
            >
              <a-checkbox
                v-if="functionality.parameter.unlimited.supported"
                v-model:checked="functionality.parameter.unlimited.value"
                class="unlimited-checkbox"
              >
                {{ getTranslatedText(functionality, 'PARAMETER.UNLIMITED_CHECKBOX') }}
              </a-checkbox>

              <a-input
                v-model:value="functionality.parameter.maximum.value"
                type="number"
                :disabled="data.parameter?.readonly || functionality.parameter.unlimited.value"
              ></a-input>
            </a-form-item>
          </div>

          <div v-if="functionality.parameter.type === 'UNIT_TIME_ALL'">
            <a-form-item
              :label="getTranslatedText(functionality, 'PARAMETER.TITLE')"
              :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION')"
            >
              <a-input
                v-model:value="functionality.parameter.defaut.value"
                type="number"
                :disabled="data.parameter?.readonly"
              >
                <template #addonAfter>
                  <a-select v-model:value="functionality.parameter.defaut.unit">
                    <a-select-option v-for="unit in functionality.parameter?.defaut.units" :key="unit" :value="unit">
                      {{ t(`FUNCTIONALITIES.UNITS.TIME.${unit}`) }}
                    </a-select-option>
                  </a-select>
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              :label="getTranslatedText(functionality, 'PARAMETER.TITLE_MAXIMUM')"
              :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION_MAXIMUM')"
            >
              <a-input
                v-model:value="functionality.parameter.maximum.value"
                type="number"
                :disabled="data.parameter?.readonly || functionality.parameter.unlimited.value"
              >
                <template #addonAfter>
                  <a-select v-model:value="functionality.parameter.maximum.unit" :disabled="data.parameter?.readonly">
                    <a-select-option v-for="unit in functionality.parameter?.maximum.units" :key="unit" :value="unit">
                      {{ t(`FUNCTIONALITIES.UNITS.TIME.${unit}`) }}
                    </a-select-option>
                  </a-select>
                </template>
              </a-input>
            </a-form-item>

            <a-form-item :extra="getTranslatedText(functionality, 'PARAMETER.UNLIMITED_CHECKBOX')">
              <a-checkbox v-model:checked="functionality.parameter.unlimited.supported" class="unlimited-checkbox">
                {{ t('FUNCTIONALITIES.DEFAULT.PARAMETER.UNLIMITED_CHECKBOX') }}
              </a-checkbox>
            </a-form-item>
          </div>

          <div v-if="functionality.parameter.type === 'UNIT_SIZE_ALL'">
            <a-form-item
              :label="getTranslatedText(functionality, 'PARAMETER.TITLE')"
              :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION')"
            >
              <a-input
                v-model:value="functionality.parameter.defaut.value"
                type="number"
                :disabled="data.parameter?.readonly"
              >
                <template #addonAfter>
                  <a-select v-model:value="functionality.parameter.defaut.unit" :disabled="data.parameter?.readonly">
                    <a-select-option v-for="unit in functionality.parameter?.defaut.units" :key="unit" :value="unit">
                      {{ t(`FUNCTIONALITIES.UNITS.SIZE.${unit}`) }}
                    </a-select-option>
                  </a-select>
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              :label="getTranslatedText(functionality, 'PARAMETER.TITLE_MAXIMUM')"
              :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION_MAXIMUM')"
            >
              <a-checkbox
                v-if="functionality.parameter.unlimited.supported"
                v-model:checked="functionality.parameter.unlimited.value"
                class="unlimited-checkbox"
              >
                {{ getTranslatedText(functionality, 'PARAMETER.UNLIMITED_CHECKBOX') }}
              </a-checkbox>

              <a-input
                v-model:value="functionality.parameter.maximum.value"
                type="number"
                :disabled="data.parameter?.readonly || functionality.parameter.unlimited.value"
              >
                <template #addonAfter>
                  <a-select v-model:value="functionality.parameter.maximum.unit" :disabled="data.parameter?.readonly">
                    <a-select-option v-for="unit in functionality.parameter?.maximum.units" :key="unit" :value="unit">
                      {{ t(`FUNCTIONALITIES.UNITS.SIZE.${unit}`) }}
                    </a-select-option>
                  </a-select>
                </template>
              </a-input>
            </a-form-item>
          </div>

          <div v-if="functionality.parameter.type === 'LANGUAGE'">
            <a-form-item :label="getTranslatedText(functionality, 'PARAMETER.LANGUAGE_TITLE')">
              <a-select v-model:value="functionality.parameter.defaut.value" :disabled="data.parameter?.readonly">
                <a-select-option
                  v-for="language in functionality.parameter.defaut.languages"
                  :key="language"
                  :value="language"
                >
                  {{ t(`LOCALE.${language}`) }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div v-if="functionality.parameter.type === 'INTEGER_MAX'">
            <p class="secondary-text">
              {{ getTranslatedText(functionality, 'PARAMETER.DESCRIPTION_MAXIMUM') }}
            </p>
            <a-checkbox
              v-if="functionality.parameter.unlimited.supported"
              v-model:checked="functionality.parameter.unlimited"
              class="unlimited-checkbox"
            >
              {{ getTranslatedText(functionality, 'PARAMETER.UNLIMITED_CHECKBOX') }}
            </a-checkbox>
            <a-form-item :label="getTranslatedText(functionality, 'PARAMETER.TITLE_MAXIMUM')">
              <a-input
                v-model:value="functionality.parameter.maximum.value"
                type="number"
                :disabled="data.parameter?.readonly"
              >
              </a-input>
            </a-form-item>
          </div>
        </a-form>
      </a-collapse-panel>
    </a-collapse>

    <div class="actions">
      <a-button
        type="primary"
        :loading="saving"
        :disabled="
          data.activationPolicy?.readonly &&
          data.configurationPolicy?.readonly &&
          data.delegationPolicy?.readonly &&
          data.parameter?.readonly
        "
        @click="saveChanges()"
      >
        {{ $t('GENERAL.SAVE') }}
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.secondary-text {
  color: @text-color-secondary;
}

.actions {
  margin-top: 20px;
}

.parameter-form :deep(.ant-form-item) {
  .ant-form-item-label label {
    font-weight: 700;
  }
}

.unlimited-checkbox {
  margin-bottom: 10px;
}
</style>
