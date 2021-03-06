const searchResults = document.querySelector('.search_results');
import axios from 'axios';
import FileSaver from 'file-saver';
export default (list, format) => {
  // eslint-disable-next-line max-statements
  list.forEach((video) => {
    //Each result container
    const container = document.createElement('div');
    container.className = 'container';

    //Image div
    const imageBox = document.createElement('div');
    imageBox.className = 'imageBox';
    const image = document.createElement('img');
    image.src = video.thumbnail;

    //Video Title
    const info = document.createElement('div');
    info.className = 'infoBox';
    const titleBox = document.createElement('div');
    titleBox.className = 'titleBox';
    const songName = document.createElement('p');
    if (video.title.length < 60) {
      songName.textContent = video.title;
    } else {
      songName.textContent =
        video.title.split('').slice(0, 60).join('') + '...';
    }
    titleBox.appendChild(songName);

    //Video Details
    const details = document.createElement('div');
    details.className = 'details';
    const views = document.createElement('p');
    const duration = document.createElement('p');
    duration.textContent = 'duration: ' + video.duration;
    views.textContent = 'views: ' + video.views;
    details.appendChild(views);
    details.appendChild(duration);

    //Download Container
    const downloadContainer = document.createElement('div');
    const button = document.createElement('button');
    button.className = 'relatedButton';
    button.textContent = 'download';
    downloadContainer.className = 'download_container';
    downloadContainer.appendChild(button);
    button.addEventListener('click', (e) => {
      e.target.style.display = 'none';
      const downloadLoader = document.createElement('div');
      const loaderImage = document.createElement('img');
      downloadLoader.className = 'download_loader';
      loaderImage.setAttribute('src', 'images/loader.gif');
      downloadLoader.appendChild(loaderImage);
      downloadContainer.appendChild(downloadLoader);

      axios({
        method: 'post',
        url: '/api/download_video',
        responseType: 'blob',
        data: {
          url: video.link,
          title: video.title,
          format,
        },
      })
        .then((response) => {
          downloadLoader.style.display = 'none';
          e.target.style.display = 'inline-block';
          e.target.disabled = true;
          const responseInfo = JSON.parse(response.config.data);
          var file = new File(
            [response.data],
            responseInfo.title + '.' + responseInfo.format
          );
          FileSaver.saveAs(file);

          //Download with Url in this case URL from S3
          // let a = document.createElement('a');
          // const downloadLink = response.data.response.Location;
          // const fileName = response.data.response.Key;
          // a.setAttribute('href', downloadLink);
          // a.setAttribute('download', fileName);
          // a.click();
        })
        .catch((error) => {
          throw new Error(error);
        });
    });

    //APPEND ACTIONS
    info.appendChild(titleBox);
    info.appendChild(details);
    imageBox.appendChild(image);
    container.appendChild(imageBox);
    container.appendChild(info);
    container.appendChild(downloadContainer);
    searchResults.appendChild(container);
  });
};
