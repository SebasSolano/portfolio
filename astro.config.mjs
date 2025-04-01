import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { fileURLToPath } from 'url';

export default defineConfig({
    integrations: [tailwind(), vue()],
    vite: {
      ssr: {
        noExternal: ['ant-design-vue', '@ant-design/icons-vue']
      },
      resolve: {
        alias: {
          '@ant-design/icons-svg/es/asn/': fileURLToPath(new URL('./node_modules/@ant-design/icons-svg/es/asn/', import.meta.url))
        }
      },
      plugins: [
        Components({
          resolvers: [
            AntDesignVueResolver({
              importStyle: false,
              resolveIcons: false,
            }),
          ],
          dts: true,
        }),
      ],
    },
  });
