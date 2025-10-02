// sanity/schemas/blockContentType.ts
import { defineType, defineArrayMember } from "sanity";

export const blockContentType = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [{title: "Bullet", value:"bullet"}],
    //   Marks let you mark up inline test in the Portable Text Editor
      marks: {
        // Decorators usually descibe a single property - eg: a typograhic
        // preference or highlighting
        decorators: [
            {title: "Strong", value: 'strong'},
            {title: "Emphasis", value: "em"}
        ],
        // Annotations can be any oject structure - eg: a link or a footnote
        annotations: []
      }
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
