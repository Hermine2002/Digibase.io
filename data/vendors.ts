export type Vendor = {
  name: string;
  logo: string;
  category: string;
  scale?: number;
};

export const vendors: Vendor[] = [
  {
    name: "Oracle",
    logo: "/images/vendors/oracle-Photoroom.png",
    category: "Database & Cloud",
    scale: 1.15,
  },

  {
    name: "Huawei",
    logo: "/images/vendors/huawei-Photoroom.png",
    category: "Infrastructure",
    scale: 1.05,
  },

  {
    name: "Cisco",
    logo: "/images/vendors/cisco-Photoroom.png",
    category: "Networking",
    scale: 1.2,
  },

  {
    name: "Dell",
    logo: "/images/vendors/dell-Photoroom.png",
    category: "Compute & Storage",
    scale: 1.1,
  },

  {
    name: "VMware",
    logo: "/images/vendors/vmware-Photoroom.png",
    category: "Virtualization",
    scale: 1.15,
  },

  {
    name: "Microsoft",
    logo: "/images/vendors/microsoft-Photoroom.png",
    category: "Software",
    scale: 1.1,
  },

  {
    name: "Nvidia",
    logo: "/images/vendors/nvidia-Photoroom.png",
    category: "AI & GPU",
    scale: 1.15,
  },

  {
    name: "Fortinet",
    logo: "/images/vendors/fortinet-Photoroom.png",
    category: "Security",
    scale: 1.2,
  },
];