# encoding: utf-8

class DisappearedsController < ApplicationController
  before_filter :authenticate_user!, except: [:index, :disappeared_static, :create]
  before_action :set_disappeared, only: [:show, :edit, :update, :destroy]

  # GET /disappeareds
  # GET /disappeareds.json
  def index
    if params[:page]
      @disappeareds = Disappeared.all.page(params[:page]).order('id desc')
    else
      @disappeareds = Disappeared.all.page.order('id desc')
    end
  end

  # GET /disappeareds/1
  # GET /disappeareds/1.json
  def show
  end

  # GET /disappeareds/new
  def new
    @disappeared = Disappeared.new
  end

  # GET /disappeareds/1/edit
  def edit
  end

  # POST /disappeareds
  # POST /disappeareds.json
  def create
    @disappeared = Disappeared.new(disappeared_params)

    @disappeared.image = parse_image_data(disappeared_params[:image]) if params[:api]

    respond_to do |format|
      if @disappeared.save
        format.html { redirect_to root_path, notice: 'Disappeared was successfully created.' }
        format.json { render :show, status: :created, location: @disappeared }
      else
        format.html { render :new }
        format.json { render json: @disappeared.errors, status: :unprocessable_entity }
      end
    end
    clean_tempfile
  end

  def create_external
    @disappeared = Disappeared.new
    @disappeared.name = params[:name]
    @disappeared.phone = params[:phone]
    @disappeared.bo = params[:bo]
    @disappeared.email = params[:email]
    @disappeared.name_disappeared = params[:name_disappeared]
    @disappeared.birth = params[:birth]
    @disappeared.sex = params[:sex]
    @disappeared.height = params[:height]
    @disappeared.weight = params[:weight]
    @disappeared.eye = params[:eye]
    @disappeared.hair = params[:hair]
    @disappeared.skin = params[:skin]
    @disappeared.description = params[:description]
    @disappeared.location = params[:location]
    @disappeared.lat = params[:lat]
    @disappeared.long = params[:long]
    @disappeared.image = params[:image]
    @disappeared.terms = params[:terms]

    respond_to do |format|
      if @disappeared.save
        format.html
        format.json { render :show, status: :created, location: @disappeared }
      else
        format.html
        format.json { render json: @disappeared.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /disappeareds/1
  # PATCH/PUT /disappeareds/1.json
  def update
    respond_to do |format|
      if @disappeared.update(disappeared_params)
        format.html { redirect_to root_path, notice: 'Disappeared was successfully updated.' }
        format.json { render :show, status: :ok, location: @disappeared }
      else
        format.html { render :edit }
        format.json { render json: @disappeared.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /disappeareds/1
  # DELETE /disappeareds/1.json
  def destroy
    @disappeared.destroy
    respond_to do |format|
      format.html { redirect_to root_path, notice: 'Disappeared was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def disappeared_static
    @disappeared = Disappeared.find(params[:disappeared_id])
    respond_to do |format|
      format.html { render 'disappeareds/disappeareds_static' }
      format.json
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_disappeared
    @disappeared = Disappeared.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def disappeared_params
    the_params = params.require(:disappeared).permit(:name, :phone, :bo, :email, :name_disappeared, :birth, :sex, :height, :weight, :eye, :hair, :skin, :description, :location, :lat, :long, :image, :terms)
    #the_params[:image] = parse_image_data(the_params[:image]) if the_params[:image]
    #the_params
  end
end
def parse_image_data(base64_image)
    filename = "upload-image"
    in_content_type, encoding, string = base64_image.split(/[:;,]/)[1..3]

    @tempfile = Tempfile.new(filename)
    @tempfile.binmode
    @tempfile.write(Base64.decode64(string))
    @tempfile.rewind

    # for security we want the actual content type, not just what was passed in
    content_type = 'file --mime -b #{@tempfile.path}'.split(";")[0]

    # we will also add the extension ourselves based on the above
    # if it's not gif/jpeg/png, it will fail the validation in the upload model
    extension = content_type.match(/gif|jpeg|png/).to_s
    filename += ".#{extension}" if extension

    ActionDispatch::Http::UploadedFile.new({
      tempfile: @tempfile,
      content_type: content_type,
      filename: filename
    })
  end

  def clean_tempfile
    if @tempfile
      @tempfile.close
      @tempfile.unlink
    end
  end
