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

    const towerStatsFields = [
        {
            key: "tier5Towers",
            label: "Extra Tier 5s",
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
            key: "powerTotems",
            label: "Totems",
            min: 0,
            max: 100,
            tooltip: "Paragon power totems placed.",
        },
    ];

    const cashFields = [
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
            label: "Cash Injection",
            min: 0,
            max: 10000000,
            tooltip: "Allowed cash injection for the paragon. 3.15x base cost.",
        },
    ];

    const inputFields = [...towerStatsFields, ...cashFields];

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
        results = calculateLevel();
    });

    onMount(() => {
        fetch(`${base}/json/paragons.json`)
            .then((r) => r.json())
            .then((data) => (towers = data))
            .catch(console.error);
    });
</script>

<div class="min-h-screen p-2 md:p-4 flex items-center flex-col">
    <header class="flex items-center gap-3 mb-4">
        <enhanced:img
            src={getIcon("paragonicon.webp")}
            alt=""
            class="w-16 md:w-20"
            fetchpriority="high"
        />
        <h1
            class="text-2xl md:text-4xl font-bold text-white text-stroke leading-tight"
        >
            BTD6 Paragon Calculator
        </h1>
    </header>
    <div class="flex flex-col w-full max-w-5xl mx-auto gap-3">
      <div class="flex flex-col gap-3 md:flex-row">
        <!-- Tower Selection Card -->
        <div
            class="md:w-1/2 bg-linear-to-t from-card-base to-card-highlight rounded-xl border-2 border-card-border shadow-[0_0_0_2px_var(--color-card-shadow),0_4px_8px_rgba(0,0,0,0.3)] p-3 md:p-4 flex flex-col gap-3"
        >
            <h3 class="font-medium text-white text-stroke">
                Tower: <span class="text-gold"
                    >{towers.find(
                        (tower) => tower.id === formData.selectedTower,
                    )?.name ?? ""}</span
                >
            </h3>
            <div class="p-3 bg-main rounded-lg border-t-2 border-x-2 border-section-border flex-1">
                <div class="grid grid-cols-5 gap-2">
                    {#if towers.length > 0}
                        {#each towers as tower}
                            <label
                                class="relative cursor-pointer flex items-center justify-center"
                                title={tower.name}
                            >
                                <input
                                    type="radio"
                                    name="tower"
                                    value={tower.id}
                                    bind:group={formData.selectedTower}
                                    class="sr-only"
                                />
                                <div
                                    class={`relative w-full aspect-4/5 rounded-lg border-2 border-tower-border shadow-[0_0_0_1px_var(--color-tower-shadow)] bg-linear-to-t from-tower-light via-tower-dark to-tower-dark transition-all duration-150 overflow-visible ${formData.selectedTower === tower.id ? "ring-2 ring-gold scale-105" : ""}`}
                                >
                                    <enhanced:img
                                        src={getTowerIcon(tower.image)}
                                        alt={tower.name}
                                        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] max-w-none object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] pointer-events-none"
                                        loading="lazy"
                                    />
                                </div>
                            </label>
                        {/each}
                    {:else}
                        {#each Array(10) as _}
                            <div
                                class="w-full aspect-4/5 rounded-lg border-2 border-tower-border shadow-[0_0_0_1px_var(--color-tower-shadow)] bg-linear-to-t from-tower-light/60 to-tower-dark/60 animate-pulse"
                            ></div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>

        <!-- Parameters Card -->
        <div
            class="md:w-1/2 bg-linear-to-t from-card-base to-card-highlight rounded-xl border-2 border-card-border shadow-[0_0_0_2px_var(--color-card-shadow),0_4px_8px_rgba(0,0,0,0.3)] p-3 md:p-4 flex flex-col gap-3"
        >
            <!-- Difficulty chip row -->
            <h3 class="font-medium text-white text-stroke">
                Difficulty: <span class="text-gold capitalize"
                    >{formData.difficulty}</span
                >
            </h3>
            <div class="p-3 bg-main rounded-lg border-t-2 border-x-2 border-section-border">
                <div class="grid grid-cols-4 gap-2">
                    {#each ["easy", "medium", "hard", "impoppable"] as difficulty}
                        <label
                            class="relative cursor-pointer"
                            title={difficulty}
                        >
                            <input
                                type="radio"
                                name="difficulty"
                                value={difficulty}
                                bind:group={formData.difficulty}
                                class="sr-only"
                            />
                            <div
                                class={`bg-darker-blue h-11 rounded-lg border-2 border-gold transition-all duration-150 flex items-center justify-center overflow-hidden p-1 ${formData.difficulty === difficulty ? "ring-2 ring-gold scale-105" : ""}`}
                            >
                                <enhanced:img
                                    src={getIcon(`${difficulty}.webp`)}
                                    alt={difficulty}
                                    class="max-h-full max-w-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </label>
                    {/each}
                </div>
            </div>

            <!-- Tower Stats group -->
            <h3 class="font-medium text-white text-stroke">
                Tower Stats
            </h3>
            <div class="p-3 bg-main rounded-lg border-t-2 border-x-2 border-section-border flex flex-col gap-2">
                {#each towerStatsFields as field}
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
                {/each}
            </div>

            <!-- Cash group -->
            <h3 class="font-medium text-white text-stroke">
                Cash
            </h3>
            <div class="p-3 bg-main rounded-lg border-t-2 border-x-2 border-section-border flex flex-col gap-2">
                {#each cashFields as field}
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
                {/each}
            </div>
        </div>
      </div>

      <!-- Results Card (full width, bottom) -->
      <div
          class="bg-linear-to-t from-card-base to-card-highlight rounded-xl border-2 border-card-border shadow-[0_0_0_2px_var(--color-card-shadow),0_4px_8px_rgba(0,0,0,0.3)] p-3 md:p-4 flex flex-col gap-3 text-white"
      >
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 items-stretch">
              <div
                  class="p-3 bg-main rounded-lg border-t-2 border-x-2 border-section-border flex flex-col items-center justify-center gap-1"
              >
                  <div class="text-sm font-medium text-stroke">
                      Estimated Degree
                  </div>
                  <div
                      class="text-4xl font-extrabold tracking-tight leading-none bg-linear-to-t from-purple-light to-purple bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]"
                      style="-webkit-text-stroke: 1.5px black; paint-order: stroke fill;"
                  >
                      {results.level}
                  </div>
              </div>
              <div
                  class="p-3 bg-main rounded-lg border-t-2 border-x-2 border-section-border flex flex-col items-center justify-center gap-1"
              >
                  <div class="text-sm font-medium text-stroke">
                      Current Power
                  </div>
                  <div class="text-3xl font-extrabold tracking-tight text-accent text-stroke leading-none">
                      {results.currDegree.toLocaleString()}
                  </div>
              </div>
              <div
                  class="p-3 bg-main rounded-lg border-t-2 border-x-2 border-section-border flex flex-col items-center justify-center gap-1"
              >
                  <div class="text-sm font-medium text-stroke">
                      Next Degree In
                  </div>
                  <div class="text-3xl font-extrabold tracking-tight text-accent text-stroke leading-none">
                      {(results.nextDegree? (results.nextDegree - results.currDegree): 0).toLocaleString()}
                  </div>
              </div>
          </div>
      </div>
    </div>
    <footer class="mt-3 text-center text-white text-stroke">
        <p>
            By <a
                href="https://github.com/ctxx3"
                class="text-blue-400 hover:text-lg duration-75">Ctx3</a
            >
            a fork of project made by
            <a
                href="https://github.com/Kaister300/BTD6ParagonCalculator"
                class="text-blue-400 hover:text-lg duration-75">Kaister300</a
            >.
        </p>
    </footer>
</div>
