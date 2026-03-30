export type ElectricLocationCard = {
  subCA: string;
  title: string;
  address: string;
  ownerName: string;
  isFavorite?: boolean;
  isPrimary?: boolean;
  hasOverdue?: boolean;
  iconTone?: "purple" | "gold";
};

export const ELECTRIC_LOCATION_CARDS: ElectricLocationCard[] = [
  {
    subCA: "020009514839",
    title: "บ้านโมโม่",
    ownerName: "ศิญาพร นิธิธารา",
    address: "420/11 ม.1 ต.บ้านกล้วย อ. เมืองสุโขทัย จ.สุโขทัย 64000",
    isPrimary: true,
    iconTone: "purple",
  },
  {
    subCA: "020009514840",
    title: "หอพักเติมสุข",
    ownerName: "ศิญาพร นิธิธารา",
    address: "420/11 ม.1 ต.บ้านกล้วย อ. เมืองสุโขทัย จ.สุโขทัย 64000",
    iconTone: "purple",
  },
  {
    subCA: "020009514841",
    title: "บ้านคอนโดสุขใจ",
    ownerName: "ศิญาพร นิธิธารา",
    address: "123/45 ม.2 ต.ห้วรอ อ.เมืองสุโขทัย จ.สุโขทัย 64000",
    isFavorite: true,
    iconTone: "purple",
  },
  {
    subCA: "020009514842",
    title: "บ้านอาปา",
    ownerName: "ศิญาพร นิธิธารา",
    address: "123/46 ม.2 ต.ห้วรอ อ.เมืองสุโขทัย จ.สุโขทัย 64000",
    iconTone: "gold",
  },
  {
    subCA: "020009514843",
    title: "บ้านสวนคุณยาย",
    ownerName: "ศิญาพร นิธิธารา",
    address: "123/46 ม.2 ต.ห้วรอ อ.เมืองสุโขทัย จ.สุโขทัย 64000",
    iconTone: "gold",
  },
];

export function getElectricLocationBySubCA(subCA: string) {
  return ELECTRIC_LOCATION_CARDS.find((item) => item.subCA === subCA);
}
