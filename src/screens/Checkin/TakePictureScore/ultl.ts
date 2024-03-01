export type ProgramCheckIn = {
  title: string;
  id: string | number | any;
};

export type IAlbumScore = {
    id: number | string | any;
    image: {
      url: string;
      base64?: string;
    }[];
  };
export const fakeData: ProgramCheckIn[] = [
  {
    title: 'Chương trình AHC',
    id: '1',
  },
  {
    title: 'Chương trình TCH',
    id: '2',
  },
  {
    title: 'Chương trình COF',
    id: '3',
  },
  {
    title: 'Chương trình ERT',
    id: '4',
  },
];
