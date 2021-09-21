<template>
  <div class="otp-form-group">
    <input
      v-for="(character, index) in characters"
      :key="index"
      :ref="setItemRef"
      v-model="character.value"
      class="otp-input"
      type="text"
      autocomplete="off"
      :name="`otpInput${index}`"
      maxlength="1"
      required
      inputmode="numeric"
      @keyup="(event) => handleOnKeyUp(index, event)"
      @keydown="(event) => handleOnKeyDown(index, event)"
      @keypress="(event) => handleOnKeyPress(event)"
      @paste="(event) => handleOnPaste(event)"
      @click="(event) => handleOnClick(index)"
    >
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, reactive, watch, onMounted } from 'vue';

const BACKSPACE = 8;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const TIMEOUT_MILLISECONDS = 30;

interface ClipboardEvent extends Event {
  clipboardData: {
    getData: (type: string) => string;
  };
}

interface CustomHTMLElement extends HTMLElement {
  select: () => void;
}

interface Character {
  value: string;
  index: number;
  i?: number;
}

export default defineComponent({
  name: 'OtpInput',
  props: {
    size: {
      type: Number,
      default: 6
    },
    value: {
      type: String,
      default: ''
    }
  },
  emits: ['input'],
  setup (props, { emit }) {
    const characters: Character[] = reactive([0, 1, 2, 3, 4, 5].map((index: number) => ({
      index,
      value: '',
      i: index
    })));
    const elementArray: CustomHTMLElement[] = [];
    const model = ref('');

    function setItemRef (el: CustomHTMLElement) {
      elementArray.push(el);
    }

    function isNumberKey (letter: string) {
      return letter.match(/^[0-9]$/);
    }

    function setOtpValue () {
      model.value = '';

      characters.forEach((character) => {
        model.value = model.value + character.value;
      });

      emit('input', model.value);
    };

    function setCharactersAndOTPValue (arrayValue: string[] = []) {
      arrayValue.forEach((value: string, index: number) => {
        characters[index].value = value;
      });

      // Focus on the first empty element, or the last element
      setTimeout(() => {
        const indexOfEmptyInput = characters.find(char => !char.value);

        if (indexOfEmptyInput) {
          elementArray[indexOfEmptyInput.index] && elementArray[indexOfEmptyInput.index].focus();
        } else {
          elementArray[props.size - 1] && elementArray[props.size - 1].focus();
        }
      }, TIMEOUT_MILLISECONDS);

      setOtpValue();
    }

    function goToNextInput (currentIndex: number) {
      setTimeout(() => {
        elementArray[currentIndex + 1].focus();
        if (characters[currentIndex + 1].value) {
          elementArray[currentIndex + 1].select();
        }
      }, TIMEOUT_MILLISECONDS);
    }

    function goToPrevInput (currentIndex: number) {
      setTimeout(() => {
        elementArray[currentIndex - 1].focus();
        if (characters[currentIndex - 1].value) {
          elementArray[currentIndex - 1].select();
        }
      }, TIMEOUT_MILLISECONDS);
    }

    function handleOnKeyUp (index: number, event: KeyboardEvent) {
      const key = event.key;

      if (characters[index].value && isNumberKey(key)) {
        setOtpValue();

        if (index !== props.size - 1) {
          goToNextInput(index);
        }
      }
    }

    function handleOnKeyDown (index: number, event: KeyboardEvent) {
      const key = event.keyCode || event.which;
      if (key === RIGHT_ARROW && index !== props.size - 1) {
        goToNextInput(index);
      } else if ((key === LEFT_ARROW || key === BACKSPACE) && index !== 0) {
        goToPrevInput(index);
      }
    }

    function handleOnKeyPress (event: KeyboardEvent) {
      if (event.key === 'Enter' || isNumberKey(event.key)) {
        return;
      }

      event.preventDefault();
    }

    function handleOnPaste (event: ClipboardEvent) {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text/plain').split('');

      if (pastedData.find(letter => !isNumberKey(letter))) {
        return;
      }

      const otpPastedData = pastedData.slice(0, props.size);

      setCharactersAndOTPValue(otpPastedData);
    }

    function handleOnClick (index: number) {
      if (characters[index].value) {
        elementArray[index].select();
      }
    }

    watch(() => props.value, (newValue: string, oldValue: string) => {
      if (newValue !== oldValue) {
        setCharactersAndOTPValue(newValue.split(''));
      }
    });

    onMounted(() => {
      setCharactersAndOTPValue(props.value.split('') || []);
    });

    return {
      characters,
      setItemRef,
      handleOnKeyUp,
      handleOnKeyDown,
      handleOnKeyPress,
      handleOnPaste,
      handleOnClick
    };
  }
});
</script>

<style lang='less' scoped>
  .otp-form-group {
    width: 100%;
    overflow: hidden;
    display: flex;

    .otp-input {
      border: none;
      border-bottom: 2px solid;
      border-radius: 0;
      display: inline-block;
      text-align: center;
      outline: none;
      box-shadow: none;
      background: transparent;
      border-color: @border-color-base;
      font-size: 20px;
      margin: 0 1.2%;
      width: 14.2%;
    }
  }
</style>
