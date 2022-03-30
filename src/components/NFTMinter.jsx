function NFTMinter(props) {

  return (
    <div class="container">
        <div class="row">
            <div class="title">NFT Minter</div>
                <div id="app" class="col-md-6 offset-md-3">
                    <div class="form_element">
                        <input class="form-control" type="text" id="input_name" name="name" placeholder="Token name"/>
                    </div>
                    <div class="form_element">
                        <input class="form-control" type="text" id="input_description" name="description" placeholder="Description"/>
                    </div>
                    <div class="form_element">
                        <input class="form-control" type="file" id="input_image" name="image" accept="image/png, image/jpeg"/>
                    </div>
                    <div class="form_element">
                        <button class="btn btn-primary btn-lg btn-block" id="submit_button">Submit</button>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default NFTMinter;
