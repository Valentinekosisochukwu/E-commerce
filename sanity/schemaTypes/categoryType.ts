// sanity/schemas/category.ts
import { TagIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
        name: "slug",
        type: "slug",
        options:{
            source: "title",
        },
    }),
    defineField({
        name: "description",
        type: "text"
    })
  ],
  preview: {
    select: {
        title: "title",
        subtitle: "description",
    }
  }
});
