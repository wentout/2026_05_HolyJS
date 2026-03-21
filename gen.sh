#!/bin/bash
set -e

echo "=== Mnemonica Slider Build ==="

# 1. Generate slides/list.txt
echo "Generating slide manifest..."
rm -f slider/slides/list.txt
names=$(ls ./slider/slides/ | grep -E '\.(json|md|mdx|txt)')
for t in $names; do {
	name=$(echo ./slider/slides/$t)
	count=$(grep -E '(-----|\},\{)' -- $name | wc -l)
	echo $t $count >> ./slider/slides/list.txt
}; done

# 2. Run tactica analysis
echo "Running tactica analysis..."
cd slider

# Run real tactica from @mnemonica/tactica
npx tactica --project ./tsconfig.json --output .tactica 2>/dev/null || echo "Tactica analysis skipped"

# Copy outputs for runtime access
if [ -d .tactica ]; then
	mkdir -p public/tactica
	cp .tactica/*.json public/tactica/ 2>/dev/null || true
fi

cd ..
cat slider/slides/list.txt
echo "=== Build complete ==="
