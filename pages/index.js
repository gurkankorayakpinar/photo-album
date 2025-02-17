import fs from 'fs';
import path from 'path';
import styles from '../styles/Home.module.css';

// Rekürsif olarak klasör ve dosyaları tarayan fonksiyon
function getAllImages(dir) {
  let results = [];

  // Klasördeki tüm dosya ve klasörleri oku
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Eğer bu bir klasörse, içine gir ve dosyaları topla
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllImages(filePath)); // Rekürsif çağrı
    } else {
      // Eğer bu bir dosyaysa ve resim dosyasıysa (örneğin .jpg, .png), listeye ekle
      if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
        results.push(filePath);
      }
    }
  });

  return results;
}

export async function getStaticProps() {
  // public/images klasörünün yolunu al
  const imagesDirectory = path.join(process.cwd(), 'public/images');

  // Tüm resim dosyalarını topla
  const imageFiles = getAllImages(imagesDirectory);

  // Dosya yollarını public klasörüne göre ayarla
  const images = imageFiles.map(file => file.replace(/.*?public/, ''));

  return {
    props: {
      images,
    },
  };
}

export default function Home({ images }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Photo Album</h1>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <div key={index} className={styles.gridItem}>
            <img src={image} alt={`Image ${index + 1}`} className={styles.image} />
          </div>
        ))}
      </div>
    </div>
  );
}