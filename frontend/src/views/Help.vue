<template>
    <div class="packHelp">
        <h1>Guid to create your own pack</h1>
        <p>
            The packs is in the following JSON format.
        </p>
        <p> 
            <pre> <code class="language-json" v-html="code"></code></pre>
        </p>
        <p>The Attribute pick defines how many answercards are needed</p>
    </div>
</template>
<script>
import 'highlight.js/lib/common';
import HilightJs from 'highlight.js'
import example from '../scripts/example.json'
export default {
    name: 'Help',
    data() {
        return {
            test: JSON.stringify(example, null, '\t'),
            code: HilightJs.highlight(JSON.stringify(example, null, 4), {language: 'json'}).value
        }
    },
}
</script>
<style>
.packHelp {
    padding: 2ch;
}
.packHelp > *{
    margin-bottom: 2ch;
}
</style>