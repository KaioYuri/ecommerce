import {
  IconStack2,
  IconShoppingBag,
  IconBuildingStore
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Vendas",
    icon: IconBuildingStore,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Estoque",
  },
  {
    id: uniqueId(),
    title: "Produtos",
    icon: IconStack2,
    href: "/estoque/produtos",
  },
  {
    id: uniqueId(),
    title: "Compras",
    icon: IconShoppingBag,
    href: "/estoque/compras",
  },
];

export default Menuitems;
