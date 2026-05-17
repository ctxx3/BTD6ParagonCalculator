<script lang="ts">
    let {
        value = $bindable(0),
        max = 100,
        label = "",
        description = "",
    } = $props();

    // percentage for filled portion
    let pct = $derived(
        (+max || 100) > 0
            ? Math.max(0, Math.min(100, ((+value || 0) / (+max || 100)) * 100))
            : 0,
    );

    // generate a unique id for accessibility
    let inputId = `slider-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div class="flex flex-col gap-2 text-white">
    <div class="flex items-center gap-2">
        <label class="text-stroke" for={inputId}>{label}</label>
        {#if description}
            <div class="group relative">
                <span class="ms-1 cursor-pointer text-stroke text-accent"
                    >?</span
                >
                <div
                    class="absolute z-50 hidden text-sm group-hover:block bg-black text-white rounded p-2 w-40 left-1/2 -translate-x-1/2 mt-1 shadow-lg"
                >
                    {description}
                </div>
            </div>
        {/if}

        <div
            class="ml-auto flex gap-2 items-center opacity-90"
            aria-hidden={description ? "false" : "true"}
        >
            <div class="px-2 text-accent text-stroke">
                {value.toLocaleString()}
            </div>
        </div>
    </div>

    <div class="relative h-7 flex items-center">
        <div
            class="relative h-4 w-full bg-[#352112] rounded-md overflow-hidden"
        >
            <div
                class="absolute left-0.75 top-0.75 bottom-0.75 bg-[#a1fc4e] rounded-l-lg"
                style="width: calc((100% - 6px) * {pct / 100});"
            ></div>
        </div>

        <!-- range input overlays the track and controls the value -->
        <input
            id={inputId}
            type="range"
            min="0"
            max={+max || 100}
            bind:value
            aria-valuemin="0"
            aria-valuemax={+max || 100}
            aria-valuenow={+value || 0}
            aria-label={label || "slider"}
            class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-7 bg-transparent m-0 p-0 z-10 cursor-pointer appearance-none"
        />
    </div>
</div>
