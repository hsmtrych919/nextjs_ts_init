import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../setup/test-utils';
import GridPhoto from '@/components/ui/GridPhoto';
import { mockGalleryData } from '../../setup/mocks/galleryData.mock';

// rewritePath.tsxのモック
jest.mock('@/lib/utils/rewritePath', () => ({
  ImgPath: ({ src, alt, className }: any) => (
    <img src={`/img/${src}?v=mock`} alt={alt} className={className} />
  ),
}));

describe('GridPhoto', () => {
  const mockOnPhotoClick = jest.fn();
  const defaultProps = {
    images: mockGalleryData.exterior.images,
    category: 'exterior' as const,
    onPhotoClick: mockOnPhotoClick,
    hasOpenedModal: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本的な表示', () => {
    it('画像一覧が正しく表示される', () => {
      render(<GridPhoto {...defaultProps} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(defaultProps.images.length);

      // 最初の画像の属性を確認
      const firstImage = images[0];
      expect(firstImage).toHaveAttribute('src', '/img/exterior_thumb_01.jpg?v=mock');
      expect(firstImage).toHaveAttribute('alt', 'モック外観画像');
    });

    it('各画像がボタン内に配置されている', () => {
      render(<GridPhoto {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(defaultProps.images.length);

      buttons.forEach((button, index) => {
        const image = screen.getByAltText(defaultProps.images[index].alt);
        expect(button).toContainElement(image);
      });
    });

    it('グリッドクラスが正しく適用される', () => {
      const { container } = render(<GridPhoto {...defaultProps} />);

      const gridContainer = container.querySelector('ul');
      expect(gridContainer).toHaveClass('grid');
      expect(gridContainer).toHaveClass('grid--2');
      expect(gridContainer).toHaveClass('grid--sm-4');
      expect(gridContainer).toHaveClass('grid--container--list');
    });
  });

  describe('「タップして拡大」案内表示', () => {
    it('1枚目の画像に案内が表示される（hasOpenedModal: false）', () => {
      render(<GridPhoto {...defaultProps} hasOpenedModal={false} />);

      expect(screen.getByText('タップして拡大')).toBeInTheDocument();
    });

    it('モーダル起動後は案内が表示されない（hasOpenedModal: true）', () => {
      render(<GridPhoto {...defaultProps} hasOpenedModal={true} />);

      expect(screen.queryByText('タップして拡大')).not.toBeInTheDocument();
    });

    it('2枚目以降の画像には案内が表示されない', () => {
      render(<GridPhoto {...defaultProps} hasOpenedModal={false} />);

      const buttons = screen.getAllByRole('button');
      const firstButton = buttons[0];
      const secondButton = buttons[1];

      // 1枚目には案内がある
      expect(firstButton).toHaveTextContent('タップして拡大');
      
      // 2枚目には案内がない
      expect(secondButton).not.toHaveTextContent('タップして拡大');
    });

    it('案内のスタイルクラスが正しく適用される', () => {
      render(<GridPhoto {...defaultProps} hasOpenedModal={false} />);

      const guideElement = screen.getByText('タップして拡大');
      expect(guideElement).toHaveClass('guide--overlay');
    });
  });

  describe('画像クリック処理', () => {
    it('画像クリック時にonPhotoClickが呼ばれる', () => {
      render(<GridPhoto {...defaultProps} />);

      const firstButton = screen.getAllByRole('button')[0];
      fireEvent.click(firstButton);

      expect(mockOnPhotoClick).toHaveBeenCalledTimes(1);
      expect(mockOnPhotoClick).toHaveBeenCalledWith(
        defaultProps.images[0],
        0
      );
    });

    it('複数の画像でそれぞれ正しい引数でコールバックが呼ばれる', () => {
      render(<GridPhoto {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      
      // 2枚目をクリック
      fireEvent.click(buttons[1]);
      expect(mockOnPhotoClick).toHaveBeenCalledWith(
        defaultProps.images[1],
        1
      );

      // 1枚目をクリック
      fireEvent.click(buttons[0]);
      expect(mockOnPhotoClick).toHaveBeenCalledWith(
        defaultProps.images[0],
        0
      );
    });

    it('案内表示中もクリックが正常に動作する', () => {
      render(<GridPhoto {...defaultProps} hasOpenedModal={false} />);

      const firstButton = screen.getAllByRole('button')[0];
      fireEvent.click(firstButton);

      expect(mockOnPhotoClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('異なるカテゴリでの表示', () => {
    it('居室カテゴリでも案内が1枚目に表示される', () => {
      render(
        <GridPhoto 
          images={mockGalleryData.interior.images}
          category="interior"
          onPhotoClick={mockOnPhotoClick}
          hasOpenedModal={false}
        />
      );

      expect(screen.getByText('タップして拡大')).toBeInTheDocument();
    });

    it('共用部カテゴリでも案内が1枚目に表示される', () => {
      render(
        <GridPhoto 
          images={mockGalleryData.common.images}
          category="common"
          onPhotoClick={mockOnPhotoClick}
          hasOpenedModal={false}
        />
      );

      expect(screen.getByText('タップして拡大')).toBeInTheDocument();
    });
  });

  describe('エッジケース', () => {
    it('画像配列が空の場合でもエラーが発生しない', () => {
      expect(() => {
        render(
          <GridPhoto 
            images={[]}
            category="exterior"
            onPhotoClick={mockOnPhotoClick}
            hasOpenedModal={false}
          />
        );
      }).not.toThrow();

      expect(screen.queryByText('タップして拡大')).not.toBeInTheDocument();
    });

    it('1枚のみの場合、案内が正しく表示される', () => {
      const singleImage = [mockGalleryData.exterior.images[0]];
      
      render(
        <GridPhoto 
          images={singleImage}
          category="exterior"
          onPhotoClick={mockOnPhotoClick}
          hasOpenedModal={false}
        />
      );

      expect(screen.getByText('タップして拡大')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });
  });

  describe('アクセシビリティ', () => {
    it('すべての画像に適切なalt属性が設定されている', () => {
      render(<GridPhoto {...defaultProps} />);

      defaultProps.images.forEach((image) => {
        expect(screen.getByAltText(image.alt)).toBeInTheDocument();
      });
    });

    it('ボタンにキーボードでアクセス可能', () => {
      render(<GridPhoto {...defaultProps} />);

      const firstButton = screen.getAllByRole('button')[0];
      firstButton.focus();
      expect(firstButton).toHaveFocus();

      fireEvent.keyDown(firstButton, { key: 'Enter', code: 'Enter' });
      // Enterキーでもクリックイベントが発生することを期待
    });
  });
});