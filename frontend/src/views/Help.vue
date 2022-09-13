<template>
    <div class="packHelp">
        <h1 v-if="!shortened">Guid to create your own pack</h1>
        <p>
            Your pack should be in the following JSON format.
        </p>
        <p>
        <pre> <code class="language-json" v-html="code"></code></pre>
        </p>
        <p v-if="!shortened">The Attribute pick defines how many answerers are needed</p>
        <input type="button" value="Download example" @click="downloadExample()">
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import 'highlight.js/lib/common';
import HilightJs from 'highlight.js'
import example from '../scripts/example.json'

const props = defineProps({
    shortened: {
        type: Boolean,
        default: false
    }
})

const test = ref(JSON.stringify(example, null, '\t'))
const code = ref(HilightJs.highlight(JSON.stringify(example, null, 4), { language: 'json' }).value)
function downloadExample() {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(example, null, '\t')], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'example.json';
    a.click();
}
</script>
<style>
@import url("//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-dark.min.css");

.packHelp {
    padding: 2ch;
}

.packHelp>* {
    margin-bottom: 2ch;
}
</style>