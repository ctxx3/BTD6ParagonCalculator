<script lang="ts">
    let {
        value = $bindable(0),
        max = 100,
        label = "",
        description = "",
    }: {
        value: number;
        max?: number;
        label?: string;
        description?: string;
    } = $props();

    const inputId = $props.id();
    const safeMax = $derived(max > 0 ? max : 100);
    const pct = $derived(Math.max(0, Math.min(100, (value / safeMax) * 100)));

    $effect(() => {
        if (value > safeMax) value = safeMax;
    });
</script>

<div class="flex flex-col gap-1.5 text-white">
    <div class="flex items-center gap-2 text-sm leading-none">
        <label class="text-stroke" for={inputId}>{label}</label>
        {#if description}
            <div class="group relative flex items-center">
                <span
                    class="cursor-help text-stroke text-accent inline-flex items-center justify-center w-4 h-4 text-xs"
                    aria-hidden="true">?</span
                >
                <div
                    class="absolute z-50 hidden group-hover:block bg-black/95 text-white text-xs rounded p-2 w-48 left-0 top-full mt-1 shadow-lg pointer-events-none normal-case"
                >
                    {description}
                </div>
            </div>
        {/if}
        <div class="ml-auto text-accent text-stroke">
            {value.toLocaleString()}
        </div>
    </div>

    <div class="relative h-6 flex items-center">
        <div
            class="relative h-5 w-full bg-slider-track rounded-md overflow-hidden border border-black/40"
        >
            <div
                class="absolute left-0.5 top-0.5 bottom-0.5 bg-purple rounded-l-sm"
                style="width: calc((100% - 4px) * {pct / 100});"
            ></div>
        </div>

        <input
            id={inputId}
            type="range"
            min="0"
            max={safeMax}
            bind:value
            aria-valuemin="0"
            aria-valuemax={safeMax}
            aria-valuenow={value}
            aria-label={label || "slider"}
            class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-6 bg-transparent m-0 p-0 z-10 cursor-pointer appearance-none"
        />
    </div>
</div>
