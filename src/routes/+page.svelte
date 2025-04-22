<script lang="ts">
    import { degreeCalc, PARAGON_LEVELS, powerCalc } from "$lib/paragon-calc";
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    const inputFields = [
        {
            key: "tier5Towers",
            label: "Extra Tier 5 Towers",
            min: 0,
            max: 9,
            tooltip: "Tier 5 Towers (excluding initial 3).",
        },
        {
            key: "upgrades",
            label: "Upgrades",
            min: 0,
            max: 100,
            tooltip: "All upgrade tiers spent on towers excluding Tier 5s. Max 100.",
        },
        {
            key: "popCount",
            label: "Pop Count",
            min: 0,
            max: 16200000,
            tooltip: "Bloons popped from every tower of the paragon type. Max 16.2M.",
        },
        {
            key: "cashSpent",
            label: "Cash Spent",
            min: 0,
            max: 5000000,
            tooltip: "Total spent on towers excluding T5s. Max $5,000,000.",
        },
        {
            key: "cashGenerated",
            label: "Cash Generated",
            min: 0,
            max: 4050000,
            tooltip: "Buccaneer & Engineer only. Max $4.05M.",
        },
        {
            key: "cashInjections",
            label: "Cash Slider",
            min: 0,
            max: 10000000,
            tooltip: "Allowed cash injection for the paragon. 3.15x base cost.",
        },
        {
            key: "powerTotems",
            label: "Paragon totems",
            min: 0,
            max: 999,
            tooltip: "",
        },
    ];

    let formData = $state({
        selectedTower: 1,
        difficulty: "easy",
        tier5Towers: 0,
        upgrades: 0,
        cashSpent: 0,
        cashGenerated: 0,
        cashInjections: 0,
        popCount: 0,
        powerTotems: 0,
    });

    interface Tower {
        id: number;
        name: string;
        image: string;
        prices: {
            [key: string]: number;
        };
    }
    let towers = $state<Tower[]>([]);
    let results = $state({
        level: 2,
        currDegree: 0,
        nextDegree: 2000,
    });

    function calculateLevel() {
        const tower = towers.find((tower) => tower.id === formData.selectedTower);
        if (!tower) {
            return {
                level: 0,
                currDegree: 0,
                nextDegree: 0,
            };
        }
        const power = powerCalc(
            formData.tier5Towers,
            formData.upgrades,
            formData.cashSpent,
            formData.cashInjections,
            formData.popCount,
            formData.cashGenerated,
            formData.powerTotems,
            tower.prices[formData.difficulty]
        );
        const degree = degreeCalc(power, PARAGON_LEVELS)
        return {
            level: degree,
            currDegree: power,
            nextDegree: PARAGON_LEVELS[degree],
        };
    }

    $effect(() => {
        results = calculateLevel();
    });

    onMount(() => {
        fetch(`${base}/json/paragons.json`)
            .then((r) => r.json())
            .then((data) => (towers = data))
            .catch(console.error);
    });
</script>

<div class="min-h-screen p-2 md:p-6 flex items-center flex-col">
    <img
        src="icons/paragonicon.webp"
        alt="BTD6 Logo"
        class="w-24 md:w-42 mb-4"
    />
    <h1 class="text-3xl md:text-5xl font-bold text-white text-stroke text-center mb-4">
        BTD6 Paragon Calculator
    </h1>
    <div class="flex flex-col w-full max-w-5xl mx-auto gap-4 md:flex-row">
        <!-- Inputs Card -->
        <div class="md:w-1/2 bg-main rounded-xl shadow-lg p-3 md:p-5 flex flex-col gap-3">
            <h2 class="text-lg md:text-xl font-semibold mb-2 text-white text-stroke flex items-center gap-2">
                Tower & Parameters
            </h2>
            <!-- Tower Selection -->
            <div>
                <h3 class="font-medium mb-1 text-white text-stroke">Selected Tower: {towers.find((tower) => tower.id === formData.selectedTower)?.name}</h3>
                <div class="flex gap-2 overflow-x-auto py-2">
                    {#if towers.length > 0}
                        {#each towers as tower}
                            <label class="relative cursor-pointer flex flex-col items-center min-w-[60px]">
                                <input
                                    type="radio"
                                    name="tower"
                                    value={tower.id}
                                    bind:group={formData.selectedTower}
                                    class="sr-only"
                                />
                                <div
                                    style="background-image: url({base + tower.image});"
                                    class={`bg-darker-blue w-12 h-12 md:w-14 md:h-14 bg-center bg-contain bg-no-repeat rounded-lg border-2 transition-all duration-150 ${formData.selectedTower === tower.id ? "border-gold ring-2 ring-gold scale-105" : "border-gold hover:border-gold"}`}
                                ></div>
                                <span class="text-xs text-stroke text-center mt-1 text-white truncate w-14">{tower.name}</span>
                            </label>
                        {/each}
                    {:else}
                        <!-- Skeleton placeholders for tower icons -->
                        {#each Array(9) as _, i}
                            <div class="flex flex-col items-center min-w-[60px] animate-pulse">
                                <div class="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded-lg mb-1"></div>
                                <div class="w-10 h-4 bg-gray-200 rounded"></div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
            <!-- Input Form -->
            <form class="grid grid-cols-1 md:grid-cols-2 gap-2 text-white">
                <div class="flex flex-col">
                    <label for="difficulty" class="font-medium mb-1 text-stroke">Difficulty</label>
                    <select
                        class="px-2 py-1 h-8 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 bg-darker-blue text-white"
                        bind:value={formData.difficulty}
                        id="difficulty"
                        name="difficulty"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="impoppable">Impoppable</option>
                    </select>
                </div>
                {#each inputFields as field}
                    <div class="flex flex-col">
                        <div class="flex gap-1">
                            <label for={field.key} class="font-medium text-stroke">{field.label}</label>
                            {#if field.tooltip !== ""}
                                <span class="group relative">
                                    <span class="ms-1 cursor-pointer text-stroke text-[#00DDFF]">?</span>
                                    <div class="absolute z-10 hidden group-hover:block bg-black text-white rounded p-2 w-40 left-1/2 -translate-x-1/2 mt-1 shadow-lg">
                                        {field.tooltip}
                                    </div>
                                </span>
                            {/if}
                        </div>
                        <input
                            type="number"
                            id={field.key}
                            bind:value={formData[field.key as keyof typeof formData]}
                            min={field.min}
                            max={field.max}
                            class="mt-1 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-darker-blue"
                            placeholder={field.label}
                        />
                    </div>
                {/each}
            </form>
        </div>
        <!-- Results Card -->
        <div class="md:w-1/2 bg-main rounded-xl shadow-lg p-3 md:p-5 flex flex-col gap-3 justify-between text-white">
            <div>
                <h2 class="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2 text-stroke">
                    Calculation Results
                </h2>
                <div class="p-3 bg-gradient-to-r bg-darker-blue rounded-lg mb-2 flex flex-col items-center">
                    <div class="text-base font-medium">Estimated Degree</div>
                    <div class="text-3xl font-extrabold tracking-tight text-[#00DDFF]">{results.level}</div>
                </div>
                <div class="grid grid-cols-2 gap-2 mb-2">
                    <div class="p-2 bg-darker-blue rounded-lg flex flex-col items-center">
                        <div class="text-xs font-medium">Current Power</div>
                        <div class="text-lg font-semibold text-[#00DDFF]">{results.currDegree.toLocaleString()}</div>
                    </div>
                    <div class="p-2 bg-darker-blue rounded-lg flex flex-col items-center">
                        <div class="text-xs font-medium">Progress to Next</div>
                        <div class="text-lg font-semibold text-[#00DDFF]">{results.nextDegree.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-4 text-center text-white text-stroke">
        <p>Created by <a href="https://github.com/ctxx3" class="text-blue-400 hover:text-lg duration-75">Ctx3</a> a fork of project made by <a href="https://github.com/Kaister300/BTD6ParagonCalculator" class="text-blue-400 hover:text-lg duration-75">Kaister300</a>.</p>
    </div>
</div>