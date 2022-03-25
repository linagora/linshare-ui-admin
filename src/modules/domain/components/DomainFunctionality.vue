<script lang="ts" setup>
import { reactive, ref, unref, watchEffect } from 'vue';
import { Functionality } from '@/core/types/Functionality';
import useFunctionalties from '../hooks/useFunctionalities';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n';

interface Props {
  data: Functionality;
  expandOnLoad?: boolean;
}

const { t } = useI18n();
const { getTranslatedText, saveFunctionality } = useFunctionalties();
const props = withDefaults(defineProps<Props>(), { expandOnLoad: false });
const functionality = reactive<Functionality>(cloneDeep(props.data));
const collapsedKeys = ref(['parameter']);
const saving = ref(false);

if (props.expandOnLoad) {
  collapsedKeys.value = ['parameter', 'activation', 'delegation', 'configuration'];
}

async function saveChanges() {
  saving.value = true;
  await saveFunctionality(unref(functionality));
  saving.value = false;
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
        v-if="data.activationPolicy"
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
            {{ $t('FUNCTIONALITIES.DEFAULT.ACTIVATION_POLICY.ENABLE_CHECKBOX_DESCRIPTION') }}
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

        <template #extra>
          <a-tag :color="data.activationPolicy.enable.value ? 'success' : 'error'">{{
            $t(data.activationPolicy.enable.value ? 'GENERAL.ENABLED' : 'GENERAL.DISABLED')
          }}</a-tag>
        </template>
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
            :label="$t('FUNCTIONALITIES.DEFAULT.PARAMETER.TITLE_MAXIMUM')"
            :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION_MAXIMUM')"
          >
            <a-input
              v-model:value="functionality.parameter.maximum.value"
              type="number"
              :disabled="data.parameter?.readonly"
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
              :label="$t('FUNCTIONALITIES.DEFAULT.PARAMETER.TITLE_MAXIMUM')"
              :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION_MAXIMUM')"
            >
              <a-input
                v-model:value="functionality.parameter.maximum.value"
                type="number"
                :disabled="data.parameter?.readonly"
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
              :label="$t('FUNCTIONALITIES.DEFAULT.PARAMETER.TITLE_MAXIMUM')"
              :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION_MAXIMUM')"
            >
              <a-input
                v-model:value="functionality.parameter.maximum.value"
                type="number"
                :disabled="data.parameter?.readonly"
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
              :label="$t('FUNCTIONALITIES.DEFAULT.PARAMETER.TITLE_MAXIMUM')"
              :extra="getTranslatedText(functionality, 'PARAMETER.DESCRIPTION_MAXIMUM')"
            >
              <a-input
                v-model:value="functionality.parameter.maximum.value"
                type="number"
                :disabled="data.parameter?.readonly"
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
        </a-form>
      </a-collapse-panel>
    </a-collapse>

    <div class="actions">
      <a-button
        type="primary"
        :loading="saving"
        :disabled="
          data.activationPolicy.readonly &&
          data.configurationPolicy.readonly &&
          data.delegationPolicy.readonly &&
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
</style>
