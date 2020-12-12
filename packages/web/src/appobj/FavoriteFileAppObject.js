import React from 'react';
import { DropDownMenuItem } from '../modals/DropDownMenu';
import FavoriteModal from '../modals/FavoriteModal';
import useShowModal from '../modals/showModal';
import axios from '../utility/axios';
import useOpenNewTab from '../utility/useOpenNewTab';
import { SavedFileAppObjectBase } from './SavedFileAppObject';

export function useOpenFavorite() {
  const openNewTab = useOpenNewTab();

  const openFavorite = React.useCallback(
    async (favorite) => {
      const { icon, tabComponent, title, props, tabdata } = favorite;
      let tabdataNew = tabdata;
      if (props.savedFile) {
        const resp = await axios.post('files/load', {
          folder: props.savedFolder,
          file: props.savedFile,
          format: props.savedFormat,
        });
        tabdataNew = {
          ...tabdata,
          editor: resp.data,
        };
      }
      openNewTab(
        {
          title,
          icon: icon || 'img favorite',
          props,
          tabComponent,
        },
        tabdataNew
      );
    },
    [openNewTab]
  );

  return openFavorite;
}

export function FavoriteFileAppObject({ data, commonProps }) {
  const { icon, tabComponent, title, props, tabdata } = data;
  const openNewTab = useOpenNewTab();
  const showModal = useShowModal();
  const openFavorite = useOpenFavorite();

  const editFavorite = () => {
    showModal((modalState) => <FavoriteModal modalState={modalState} editingData={data} />);
  };

  return (
    <SavedFileAppObjectBase
      data={data}
      commonProps={commonProps}
      format="json"
      icon={icon || 'img favorite'}
      title={title}
      disableRename
      onLoad={async (data) => {
        openFavorite(data);
      }}
      menuExt={<DropDownMenuItem onClick={editFavorite}>Edit</DropDownMenuItem>}
    />
  );
}

FavoriteFileAppObject.extractKey = (data) => data.file;