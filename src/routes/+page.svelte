<script lang="ts">
    import { degreeCalc, PARAGON_LEVELS, powerCalc } from "$lib/paragon-calc";
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import Slider from "../components/slider.svelte";
    import type { Picture } from "@sveltejs/enhanced-img";

    const iconModules = import.meta.glob(
        ["/src/lib/assets/icons/*.webp", "!/src/lib/assets/icons/thumb.webp"],
        {
            eager: true,
            query: {
                enhanced: true,
            },
            import: "default",
        },
    ) as Record<string, Picture>;

    const icons = Object.fromEntries(
        Object.entries(iconModules).map(([path, image]) => [
            path.split("/").pop(),
            image,
        ]),
    ) as Record<string, Picture>;

    function getIcon(fileName: string) {
        return icons[fileName] ?? icons["paragonicon.webp"];
    }

    function getTowerIcon(imagePath: string) {
        return getIcon(imagePath.split("/").pop() ?? "");
    }

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
            tooltip: "All upgrade tiers spent on towers excluding Tier 5s.",
        },
        {
            key: "popCount",
            label: "Pop Count",
            min: 0,
            max: 16200000,
            tooltip: "Bloons popped from every tower of the paragon type.",
        },
        {
            key: "cashSpent",
            label: "Cash Spent",
            min: 0,
            max: 5000000,
            tooltip: "Total spent on towers excluding T5s.",
        },
        {
            key: "cashGenerated",
            label: "Cash Generated",
            min: 0,
            max: 4050000,
            tooltip: "Buccaneer & Engineer only.",
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
            max: 100,
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
        tower: string;
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
        const tower = towers.find(
            (tower) => tower.id === formData.selectedTower,
        );
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
            tower.prices[formData.difficulty],
        );
        const degree = degreeCalc(power, PARAGON_LEVELS);
        return {
            level: degree,
            currDegree: power,
            nextDegree: PARAGON_LEVELS[degree],
        };
    }

    function getFieldMax(key: string) {
        if (key === "cashInjections") {
            const tower = towers.find((t) => t.id === formData.selectedTower);
            if (!tower) return 0;
            const baseCost = tower.prices?.[formData.difficulty] ?? 0;
            // 3.15x base cost per requirement
            return Math.round(baseCost * 3.15);
        } else if (key == "cashSpent") {
            const tower = towers.find((t) => t.id === formData.selectedTower);
            if (!tower) return 0;
            const baseCost = tower.prices?.[formData.difficulty] ?? 0;
            return Math.round(3 * baseCost);
        }
        const field = inputFields.find((f) => f.key === key);
        return field?.max ?? 0;
    }

    $effect(() => {
        const max = getFieldMax("cashInjections");
        if (formData.cashInjections > max) {
            formData.cashInjections = max;
        }
    });

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
    <enhanced:img
        src={getIcon("paragonicon.webp")}
        alt="BTD6 Logo"
        class="w-24 md:w-42 mb-4"
        fetchpriority="high"
    />
    <h1
        class="text-3xl md:text-5xl font-bold text-white text-stroke text-center mb-4"
    >
        BTD6 Paragon Calculator
    </h1>
    <div class="flex flex-col w-full max-w-5xl mx-auto gap-4 md:flex-row">
        <!-- Inputs Card -->
        <div
            class="md:w-1/2 bg-main rounded-xl shadow-lg p-3 md:p-5 flex flex-col gap-3"
        >
            <h2
                class="text-lg md:text-xl font-semibold mb-2 text-white text-stroke flex items-center gap-2"
            >
                Tower & Parameters
            </h2>
            <!-- Tower Selection -->
            <div>
                <h3 class="font-medium mb-1 text-white text-stroke">
                    Selected Tower: <span class="text-gold"
                        >{towers.find(
                            (tower) => tower.id === formData.selectedTower,
                        )?.name}</span
                    >
                </h3>
                <div class="grid grid-cols-4 sm:grid-cols-5 gap-3 py-2">
                    {#if towers.length > 0}
                        {#each towers as tower}
                            <label
                                class="relative cursor-pointer flex flex-col items-center"
                            >
                                <input
                                    type="radio"
                                    name="tower"
                                    value={tower.id}
                                    bind:group={formData.selectedTower}
                                    class="sr-only"
                                />
                                <div
                                    class={`bg-darker-blue w-full aspect-square rounded-lg border-2 border-gold transition-all duration-150 flex items-center justify-center p-1 ${formData.selectedTower === tower.id ? "ring-2 ring-gold scale-105" : ""}`}
                                >
                                    <enhanced:img
                                        src={getTowerIcon(tower.image)}
                                        alt={tower.name}
                                        class="h-full w-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </label>
                        {/each}
                    {:else}
                        <!-- Skeleton placeholders for tower icons -->
                        {#each Array(10) as _}
                            <div
                                class="flex flex-col items-center animate-pulse"
                            >
                                <div
                                    class="w-14 h-14 md:w-16 md:h-16 bg-gray-200 rounded-lg mb-1"
                                ></div>
                                <div class="w-12 h-3 bg-gray-200 rounded"></div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
            <!-- Input Form -->
            <form class="grid grid-cols-1 md:grid-cols-2 gap-3 text-white">
                <div class="flex flex-col">
                    <div class="flex items-center justify-between">
                        <label
                            for="difficulty"
                            class="font-medium mb-1 text-stroke"
                            >Difficulty</label
                        >
                        <span class="text-accent text-stroke"
                            >{formData.difficulty}</span
                        >
                    </div>
                    <div class="grid grid-cols-4 gap-3">
                        {#each ["easy", "medium", "hard", "impoppable"] as difficulty}
                            <label
                                class="relative cursor-pointer flex flex-col items-center"
                            >
                                <input
                                    type="radio"
                                    name="difficulty"
                                    value={difficulty}
                                    bind:group={formData.difficulty}
                                    class="sr-only"
                                />
                                <div
                                    class={`bg-darker-blue w-full aspect-square rounded-lg border-2 border-gold transition-all duration-150 flex items-center justify-center p-1 ${formData.difficulty === difficulty ? "ring-2 ring-gold scale-105" : ""}`}
                                >
                                    <enhanced:img
                                        src={getIcon(`${difficulty}.webp`)}
                                        alt={`${difficulty} difficulty`}
                                        class="h-full w-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </label>
                        {/each}
                    </div>
                </div>
                {#each inputFields as field}
                    <div class="flex flex-col">
                        <Slider
                            bind:value={
                                formData[
                                    field.key as keyof typeof formData
                                ] as number
                            }
                            max={getFieldMax(field.key)}
                            label={field.label}
                            description={field.tooltip}
                        />
                    </div>
                {/each}
            </form>
        </div>
        <!-- Results Card -->
        <div
            class="md:w-1/2 bg-main rounded-xl shadow-lg p-3 md:p-5 flex flex-col gap-3 justify-between text-white"
        >
            <div>
                <h2
                    class="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2 text-stroke"
                >
                    Calculation Results
                </h2>
                <div
                    class="p-3 bg-linear-to-r bg-darker-blue rounded-lg mb-2 flex flex-col items-center"
                >
                    <div class="text-base font-medium">Estimated Degree</div>
                    <div
                        class="text-3xl font-extrabold tracking-tight text-accent"
                    >
                        {results.level}
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2 mb-2">
                    <div
                        class="p-2 bg-darker-blue rounded-lg flex flex-col items-center"
                    >
                        <div class="text-xs font-medium">Current Power</div>
                        <div class="text-lg font-semibold text-accent">
                            {results.currDegree.toLocaleString()}
                        </div>
                    </div>
                    <div
                        class="p-2 bg-darker-blue rounded-lg flex flex-col items-center"
                    >
                        <div class="text-xs font-medium">Progress to Next</div>
                        <div class="text-lg font-semibold text-accent">
                            {results.nextDegree?.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-4 text-center text-white text-stroke">
        <p>
            Created by <a
                href="https://github.com/ctxx3"
                class="text-blue-400 hover:text-lg duration-75">Ctx3</a
            >
            a fork of project made by
            <a
                href="https://github.com/Kaister300/BTD6ParagonCalculator"
                class="text-blue-400 hover:text-lg duration-75">Kaister300</a
            >.
        </p>
    </div>
</div>
