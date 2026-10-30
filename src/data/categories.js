export const CATEGORIES = [
  {
    slug: "writing-tools",
    name: "Writing Tools",
    tint: "writing",
    blurb: "Pens, pencils and markers for notes that stay readable.",
  },
  {
    slug: "notebooks",
    name: "Notebooks & Pads",
    tint: "notebooks",
    blurb: "Ruled, graph and spiral books for every subject.",
  },
  {
    slug: "lab-records",
    name: "Lab Records",
    tint: "lab",
    blurb: "Bound records and log books for practicals.",
  },
  {
    slug: "art-craft",
    name: "Art & Craft",
    tint: "art",
    blurb: "Sketchbooks, colour and drawing kits.",
  },
  {
    slug: "calculators",
    name: "Calculators",
    tint: "calc",
    blurb: "Scientific and basic calculators for class and exams.",
  },
  {
    slug: "files-folders",
    name: "Files & Folders",
    tint: "files",
    blurb: "Keep assignments, printouts and notes in order.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    tint: "acc",
    blurb: "Bags, cases and the small things you reach for daily.",
  },
];

export function categoryBySlug(slug) {
  return CATEGORIES.find((category) => category.slug === slug) || null;
}
