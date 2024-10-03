import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./App.css";
import fetchPhoto from "./fetchPhotoApi";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import Loader from "./components/Loader/Loader";
import SearchBar from "./components/SearchBar/SearchBar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import LoadMoreButton from "./components/LoadMoreButton/LoadMoreButton";
import ImageModal from "./components/ImageModal/ImageModal";

Modal.setAppElement("#root");

interface Photo {
  id: string;
  url: string;
  title: string;
}
interface SearchBarProps {
  onSubmit: (searchQuery: string) => void;
}
interface ImageGalleryProps {
  items: Photo[];
  openModal: (imageData: Photo) => void;
}
interface LoadMoreButtonProps {
  loadMore: () => void;
}
interface ImageModalProps {
  isOpen: boolean;
  closeModal: () => void; // Змінено на () => void
  imageData: Photo | null;
}

function App() {
  const [photo, setPhoto] = useState<Photo[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedImageData, setSelectedImageData] = useState<Photo | null>(
    null
  );

  useEffect(() => {
    if (searchText === "") {
      return;
    }

    async function searchSubmit() {
      try {
        setLoader(true);
        setErrorMessage(false);
        const data = await fetchPhoto(searchText, page);
        setPhoto((prevPhoto) => {
          return [...prevPhoto, ...data];
        });
        setTotalPages(data.total_pages);
      } catch (error) {
        console.log(error);
        setErrorMessage(true);
      } finally {
        setLoader(false);
      }
    }
    searchSubmit();
  }, [searchText, page]);

  const handleSearch = (searchQuery: string): void => {
    setSearchText(searchQuery);
    setPage(1);
    setPhoto([]);
  };

  const handlClickButton = (): void => {
    setPage(page + 1);
  };

  const openModal = (imageData: Photo): void => {
    if (!modalIsOpen) {
      setSelectedImageData(imageData);
      setModalIsOpen(true); // Встановлюємо modalIsOpen на true при відкритті модального вікна
    }
  };

  const closeModal = (): void => {
    setModalIsOpen(false);
    setSelectedImageData(null);
  };

  const isLastPage = page >= totalPages;

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      {loader && <Loader />}
      {errorMessage && <ErrorMessage />}
      {photo.length > 0 && <ImageGallery items={photo} openModal={openModal} />}
      {photo.length > 0 && !loader && !isLastPage && (
        <LoadMoreButton loadMore={handlClickButton} />
      )}
      {/* Передаємо властивості для модального вікна */}
      {photo.length > 0 && (
        <ImageModal
          isOpen={modalIsOpen} // Використовуємо значення modalIsOpen замість openModal
          closeModal={closeModal}
          imageData={selectedImageData}
        />
      )}
    </div>
  );
}

export default App;
